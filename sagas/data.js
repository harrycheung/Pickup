
import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, takeEvery } from 'redux-saga/effects';
import firebase from 'firebase';

import { types } from '../actions/data';
import { actions as dataActions } from '../actions/data';
import { actions as navActions } from '../actions/navigation';

const addStudentAsync = (uid, firstName, lastInitial, relationship) => {
  return firebase.database().ref('/students')
    .push({firstName, lastInitial, relationship})
    .then((studentRef) => {
      var newStudent = {};
      newStudent[studentRef.key] = true;
      return firebase.database().ref('/users/' + uid + '/students')
        .update(newStudent)
        .then(() => (studentRef.key));
    });
};

export function* addStudent(action) {
  try {
    const { firstName, lastInitial, relationship } = action;
    const state = yield select();
    const studentKey = yield call(addStudentAsync, state.auth.user.uid, firstName, lastInitial, relationship);
    yield put(dataActions.addStudentSucceeded({key: studentKey, firstName, lastInitial, relationship}));
    yield put(navActions.navigate('Home'));
  } catch (error) {
    console.log('addStudent failed', error);
    // Do nothing?
  }
}

export function* watchAddStudent() {
  yield takeEvery(types.ADD_STUDENT, addStudent);
}

export function* pickup(action) {
  try {
    yield put(navActions.navigate('AwaitingPickup'));
  } catch (error) {
    console.log('pickup failed', error);
  }
}

export function* watchPickup(action) {
  yield takeEvery(types.PICKUP, pickup);
}
