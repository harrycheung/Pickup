
// @flow

import { all, call, fork, put, take } from 'redux-saga/effects';

import { FBref } from '../helpers/firebase';
import { firebaseChannel } from './helpers';
import { Types, Actions } from '../actions/Admin';
import { Actions as MessageActions } from '../actions/Message';

const listenPickups = function* listenPickups() {
  while (true) {
    try {
      const { grade, location } = yield take(Types.LISTEN_PICKUPS);
      const ref = location === '' ?
        FBref('/pickups').orderByChild(`grades/${grade}`).equalTo(true) :
        FBref('/pickups').orderByChild('location').equalTo(location);

      const pickupsChannel = firebaseChannel(ref, 'value');
      const pickupsListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          yield put(Actions.loadPickups(snapshot.val()));
        }
      };

      yield fork(pickupsListener, pickupsChannel);

      yield take(Types.UNLISTEN_PICKUPS);
      pickupsChannel.close();
    } catch (error) {
      console.log('listenPickups error', error);
    }
  }
}

const watchListenPickups = function* watchListenPickups() {
  yield fork(listenPickups);
}

const searchStudentsAsync = (name) => (
  FBref('/students').orderByChild('name').startAt(name).endAt(name + '\uf8ff').once('value')
    .then((snapshot) => {
      const students = snapshot.val();
      return Object.keys(students).map(studentKey => (
        Object.assign({}, students[studentKey], { key: studentKey })
      ));
    })
);

const watchSearchStudents = function* watchSearchStudents() {
  while (true) {
    try {
      const { name } = yield take(Types.SEARCH_STUDENTS);
      yield put(MessageActions.showMessage('Searching', 0));
      const students = yield call(searchStudentsAsync, name);
      yield put(Actions.setStudents(students));
    } catch (error) {
      console.log('searchStudents failed', error);
    } finally {
      yield put(MessageActions.clearMessage());
    }
  }
}

const adminSaga = function* adminSaga() {
  yield all([
    watchListenPickups(),
    watchSearchStudents(),
  ]);
};

export default adminSaga;
