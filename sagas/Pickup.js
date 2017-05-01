
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, takeEvery } from 'redux-saga/effects';
import firebase from 'firebase';

import { Types } from '../actions/Pickup';
import { Actions as PickupActions } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';

const createPickupAsync = (uid, studentKeys) => {
  let payload = {
    requestor: uid,
    students: studentKeys,
    messages: [{
      type: 'request',
    }]
  };
  return firebase.database().ref('/pickups').push(payload)
  .then((pickupRef) => {
    payload['key'] = pickupRef.key;
    return payload;
  });
};

export function* pickup(action) {
  try {
    const { students } = action;
    const state = yield select();
    const request = yield call(createPickupAsync, state.auth.user.uid, students);
    yield put(PickupActions.pickupRequested(request));
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('pickup failed', error);
    // Do nothing?
  }
}

export function* watchPickup() {
  yield takeEvery(Types.PICKUP, pickup);
}

// const cancelPickupAsync = (key) => {
//   return firebase.database().ref('/pickups/' + key).set({
//     messages: [{
//       type: 'canceled',
//     }]
//   });
// };
//
// export function* pickupCanceled(action) {
//   try {
//     const state = yield select();
//     yield call(cancelPickupAsync, state.pickup.request.key);
//
//   } catch (error) {
//     console.log('cancel pickup failed', error);
//   }
// }
//
// export function* watchPickupCanceled() {
//   yield takeEvery(Types.PICKUP_CANCELED, action);
// }
