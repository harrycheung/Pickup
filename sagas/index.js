
// @flow

import { all } from 'redux-saga/effects';

import {
  watchRequestLogin,
  watchLogin,
} from './Auth';

import {
  watchLoadStudents,
  watchAddStudent,
  watchEditStudent,
  watchDeleteStudent,
} from './Student';

import {
  watchLoadUser,
  watchCreateUser,
  watchUpdateUser,
} from './User';

import {
  watchCreatePickup,
  watchCancelPickup,
  watchResumePickup,
  watchHandlePickup,
  watchPostMessage,
  watchListenPickup,
} from './Pickup';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    watchRequestLogin(),
    watchLogin(),
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
    watchPostMessage(),
    watchHandlePickup(),
    watchListenPickup(),
  ]);
}
