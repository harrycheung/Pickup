
// @flow

import { fork, put, take } from 'redux-saga/effects';

import { FBref } from '../helpers/firebase';
import { firebaseChannel } from './helpers';
import { Types, Actions } from '../actions/Admin';

function* listenPickups() {
  while (true) {
    try {
      const { grade } = yield take(Types.LISTEN_PICKUPS);
      const ref = FBref('/pickups').orderByChild(`grades/${grade}`).equalTo(true);

      const pickupsChannel = firebaseChannel(ref, 'value');
      const pickupsListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          yield put(Actions.loadPickups(snapshot.val()));
        }
      };

      yield fork(pickupsListener, pickupsChannel);

      yield take(Types.UNLISTEN_PICKUPS);
      pickupsChannel.close();
    } catch (error) {
      console.log('listenPickups error', error);
    }
  }
}

export function* watchListenPickups() {
  yield fork(listenPickups);
}

function* updatePickup() {
  while (true) {
    try {
      const { pickupKey, studentKey, state } = yield take(Types.UPDATE_PICKUP);
      FBref(`/pickups/${pickupKey}/students/${studentKey}`).update(state);
    } catch (error) {
      console.log('updatePickup error', error);
    }
  }
}

export function* watchUpdatePickup() {
  yield fork(updatePickup);
}
