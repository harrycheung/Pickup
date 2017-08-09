
// @flow

import { all } from 'redux-saga/effects';

import authSaga from './Auth';
import studentSaga from './Student';
import userSaga from './User';
import pickupSaga from './Pickup';
import adminSaga from './Admin';
import imageSaga from './Image';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    authSaga(),
    studentSaga(),
    userSaga(),
    pickupSaga(),
    adminSaga(),
    imageSaga(),
  ]);
}
