
import { delay } from 'redux-saga'; // TODO: remove
import { put, takeEvery } from 'redux-saga/effects';

import { FBFunctions } from '../config/constants';
import { types } from '../actions/data';
import { actions as dataActions } from '../actions/data';
import { actions as navActions } from '../actions/navigation';

const addStudentAsync = (firstName, lastInitial, relationship) => {
  return fetch('https://' + FBFunctions + '/addStudent');
};

export function* addStudent(action) {
  try {
    const { firstName, lastInitial, relationship } = action;
    // const response = yield call(addStudentAsync, firstName, lastInitial, relationship);
    // if (response.status == 200) {
      const student = {key: firstName + lastInitial, firstName, lastInitial, relationship};
      yield put(dataActions.addStudentSucceeded(student));
      yield put(navActions.navigate('Home'));
    // }
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
