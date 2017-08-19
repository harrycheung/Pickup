
// @flow

import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { FBref } from '../helpers/firebase';
import { Types as UserTypes, Actions as UserActions } from '../actions/User';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';
import { Actions as StudentActions } from '../actions/Student';

const loadUserAsync = uid => (
  FBref(`/users/${uid}`).once('value').then(snapshot => snapshot.val())
);

function* loadUser(action) {
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
      yield put(UserActions.setUser(uid, response));
      yield put(StudentActions.setStudents(Object.keys(response.students)));
    }
    yield put(UserActions.loadedUser());
  } catch (error) {
    console.log('loadUser failed', error);
    // Do nothing?
  }
}

function* watchLoadUser() {
  yield takeEvery(UserTypes.LOAD, loadUser);
}

const updateUserAsync = (uid, firstName, lastInitial, image) => (
  FBref(`/users/${uid}`).update({ firstName, lastInitial, name: `${firstName} ${lastInitial}`, image })
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

function* updateUser(action) {
  yield call(updateUserWithNav, action, NavActions.back());
}

function* watchUpdateUser() {
  yield takeEvery(UserTypes.UPDATE, updateUser);
}

function* createUser(action) {
  yield call(updateUserWithNav, action, NavActions.resetNavigation('Main'));
}

function* watchCreateUser() {
  yield takeEvery(UserTypes.CREATE, createUser);
}

const updateVehiclesAsync = (uid, vehicles) => (
  FBref(`/users/${uid}`).update({ vehicles })
);

function* updateVehicles() {
  try {
    const { user } = yield select();
    yield call(updateVehiclesAsync, user.uid, user.vehicles);
  } catch (error) {
    console.log('updateVehicles failed', error);
  }
}

function* watchAddVehicle() {
  yield takeEvery(UserTypes.ADD_VEHICLE, updateVehicles);
}

function* watchRemoveVehicle() {
  yield takeEvery(UserTypes.REMOVE_VEHICLE, updateVehicles);
}

export default function* userSaga() {
  yield all([
    watchLoadUser(),
    watchCreateUser(),
    watchUpdateUser(),
    watchAddVehicle(),
    watchRemoveVehicle(),
  ]);
}
