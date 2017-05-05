
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, takeEvery } from 'redux-saga/effects';
import firebase from 'firebase';

import { Types as UserTypes } from '../actions/User';
import { Actions as UserActions } from '../actions/User';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';

const loadUserAsync = (uid) => {
  return firebase.database().ref('/users/' + uid).once('value')
  .then((snapshot) => {
    return snapshot.val();
  })
};

export function* loadUser(action) {
  try {
    let { uid } = action;
    if (uid === undefined) {
      const state = yield select();
      uid = state.auth.user.uid;
    }
    const response = yield call(loadUserAsync, uid);
    if (response === null) {
      yield put(UserActions.setUser('', ''));
    } else {
      const { firstName, lastInitial } = response;
      yield put(UserActions.setUser(firstName, lastInitial));
    }
  } catch (error) {
    console.log('loadUser failed', error);
    // Do nothing?
  }
}

export function* watchLoadUser() {
  yield takeEvery(UserTypes.LOAD, loadUser);
}

const updateUserAsync = (uid, firstName, lastInitial) => {
  return firebase.database().ref('/users/' + uid).update({firstName, lastInitial});
};

function* updateUserWithNav(action, navAction) {
  try {
    yield put(SpinnerActions.start());
    const { firstName, lastInitial } = action;
    const state = yield select();
    yield call(updateUserAsync, state.auth.user.uid, firstName, lastInitial);
    yield put(navAction);
  } catch (error) {
    console.log('updateUser failed', error);
    // Do nothing?
  } finally {
    yield put(SpinnerActions.stop());
  }

}

export function* updateUser(action) {
  yield call(updateUserWithNav, action, NavActions.back());
}

export function* watchUpdateUser() {
  yield takeEvery(UserTypes.UPDATE, updateUser);
}

export function* createUser(action) {
  yield call(updateUserWithNav, action, NavActions.resetNavigation('Main'));
}

export function* watchCreateUser() {
  yield takeEvery(UserTypes.CREATE, createUser);
}
