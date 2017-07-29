
// @flow

import { all } from 'redux-saga/effects';

import {
  watchRequestLogin,
  watchLogin,
  watchLogout
} from './Auth';

import {
  watchLoadStudents,
  watchAddStudent,
  watchEditStudent,
  watchDeleteStudent
} from './Student';

import {
  watchLoadUser,
  watchCreateUser,
  watchUpdateUser
} from './User';

import {
  watchCreatePickup,
  watchCancelPickup,
  watchResumePickup,
  watchPostMessage
} from './Pickup';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    watchRequestLogin(),
    watchLogin(),
    watchLogout(),
    watchLoadStudents(),
    watchAddStudent(),
    watchEditStudent(),
    watchDeleteStudent(),
    watchLoadUser(),
    watchCreateUser(),
    watchUpdateUser(),
    watchCreatePickup(),
    watchCancelPickup(),
    watchResumePickup(),
    watchPostMessage()
  ]);
}
