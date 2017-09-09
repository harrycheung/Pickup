
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

const loadUser = function* loadUser(action) {
  try {
    let { uid } = action;
    if (uid === undefined) {
      const state = yield select();
      uid = state.auth.user.uid;
    }
    const response = yield call(loadUserAsync, uid);
    if (response === null) {
      yield put(UserActions.setUser('', {}));
    } else {
      yield put(UserActions.setUser(uid, response));
      if (response.students) {
        yield put(StudentActions.setStudents(Object.keys(response.students)));
      }
    }
    yield put(UserActions.loadedUser());
  } catch (error) {
    console.log('loadUser failed', error);
    // Do nothing?
  }
};

const watchLoadUser = function* watchLoadUser() {
  yield takeEvery(UserTypes.LOAD, loadUser);
};

const updateUserAsync = (uid, firstName, lastInitial, image, students) => {
  const name = `${firstName} ${lastInitial}`;
  const update = {};
  update[`/users/${uid}/firstName`] = firstName;
  update[`/users/${uid}/lastInitial`] = lastInitial;
  update[`/users/${uid}/name`] = name;
  update[`/users/${uid}/image`] = image;
  students.reduce((acc, student) => {
    acc[`/students/${student.key}/relationships/${uid}/name`] = name;
    acc[`/students/${student.key}/relationships/${uid}/image`] = image;
    return acc;
  }, update);
  return FBref().update(update);
};

const updateUserWithNav = function* updateUserWithNav(action, navAction) {
  try {
    yield put(SpinnerActions.start());
    const { firstName, lastInitial, image } = action;
    const state = yield select();
    yield call(updateUserAsync,
      state.auth.user.uid,
      firstName, lastInitial, image,
      state.student.students);
    yield put(navAction);
  } catch (error) {
    console.log('updateUser failed', error);
    // Do nothing?
  } finally {
    yield put(SpinnerActions.stop());
  }
};

const updateUser = function* updateUser(action) {
  yield call(updateUserWithNav, action, NavActions.back());
};

const watchUpdateUser = function* watchUpdateUser() {
  yield takeEvery(UserTypes.UPDATE, updateUser);
};

const createUser = function* createUser(action) {
  yield call(updateUserWithNav, action, NavActions.resetNavigation('Main'));
};

const watchCreateUser = function* watchCreateUser() {
  yield takeEvery(UserTypes.CREATE, createUser);
};

const updateVehiclesAsync = (uid, vehicles) => (
  FBref(`/users/${uid}`).update({ vehicles })
);

const updateVehicles = function* updateVehicles() {
  try {
    const { user } = yield select();
    yield call(updateVehiclesAsync, user.uid, user.vehicles);
  } catch (error) {
    console.log('updateVehicles failed', error);
  }
};

const watchAddVehicle = function* watchAddVehicle() {
  yield takeEvery(UserTypes.ADD_VEHICLE, updateVehicles);
};

const watchRemoveVehicle = function* watchRemoveVehicle() {
  yield takeEvery(UserTypes.REMOVE_VEHICLE, updateVehicles);
};

const userSaga = function* userSaga() {
  yield all([
    watchLoadUser(),
    watchCreateUser(),
    watchUpdateUser(),
    watchAddVehicle(),
    watchRemoveVehicle(),
  ]);
};

export default userSaga;
