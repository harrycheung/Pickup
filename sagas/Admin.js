
// @flow

import { all, call, fork, put, take, takeLatest, select } from 'redux-saga/effects';

import * as C from '../config/constants';
import { FBref } from '../helpers/firebase';
import { todayStr } from '../helpers';
import { firebaseChannel } from './helpers';
import { Types, Actions } from '../actions/Admin';
import { Actions as MessageActions } from '../actions/Message';
import { Actions as PickupActions } from '../actions/Pickup';

const watchListenPickups = function* watchListenPickups() {
  while (true) {
    try {
      const { filter } = yield take(Types.LISTEN_PICKUPS);
      const baseRef = FBref(`/pickups/${todayStr()}`);
      let ref = baseRef;
      if (C.Levels.includes(filter)) {
        ref = baseRef.orderByChild(`grades/${filter}`).equalTo(true);
      } else if (C.Locations.includes(filter)) {
        ref = baseRef.orderByChild('location').equalTo(filter);
      } else if (filter === 'Lower School') {
        ref = baseRef.orderByChild('lowerSchool').equalTo(true);
      } else if (filter === 'Middle School') {
        ref = baseRef.orderByChild('middleSchool').equalTo(true);
      }

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
};

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
};

const releasePickups = function* releasePickups(action) {
  yield put(MessageActions.showMessage('Releasing', 0));
  const { user } = yield select();
  for (let i = 0; i < action.pickups.length; i += 1) {
    const pickup = action.pickups[i];
    const students = Object.values(pickup.students);
    for (let j = 0; j < students.length; j += 1) {
      const student = students[j];
      yield put(PickupActions.releaseStudent(pickup, user, student));
    }
    yield put(PickupActions.markCompleted(pickup));
  }
  yield put(MessageActions.clearMessage());
};

const watchReleasePickups = function* watchReleasePickups() {
  yield takeLatest(Types.RELEASE_PICKUPS, releasePickups);
};

const adminSaga = function* adminSaga() {
  yield all([
    watchListenPickups(),
    watchSearchStudents(),
    watchReleasePickups(),
  ]);
};

export default adminSaga;
