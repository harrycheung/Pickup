
// @flow

import { call, put, select, takeEvery } from 'redux-saga/effects';

import { FBref } from '../helpers/firebase';
import { Types as UserTypes, Actions as UserActions } from '../actions/User';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';

const loadUserAsync = uid => (
  FBref(`/users/${uid}`).once('value').then(snapshot => snapshot.val())
);

export function* loadUser(action) {
  try {
    let { uid } = action;
    if (uid === undefined) {
      const state = yield select();
      uid = state.auth.user.uid;
    }
    const response = yield call(loadUserAsync, uid);
    if (response === null) {
      yield put(UserActions.setUser('', '', '', '', false));
    } else {
      const { firstName, lastInitial, image, admin = false } = response;
      yield put(UserActions.setUser(uid, firstName, lastInitial, image, admin));
    }
    yield put(UserActions.loadedUser());
  } catch (error) {
    console.log('loadUser failed', error);
    // Do nothing?
  }
}

export function* watchLoadUser() {
  yield takeEvery(UserTypes.LOAD, loadUser);
}

const updateUserAsync = (uid, firstName, lastInitial, image) => (
  FBref(`/users/${uid}`).update({ firstName, lastInitial, image })
);

function* updateUserWithNav(action, navAction) {
  try {
    yield put(SpinnerActions.start());
    const { firstName, lastInitial, image } = action;
    const state = yield select();
    yield call(updateUserAsync, state.auth.user.uid, firstName, lastInitial, image);
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
