
// @flow

import { all, call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { Platform } from 'react-native';
import CryptoJS from 'crypto-js';

import { FBauth, FBref, FBfunctions } from '../helpers/firebase';
import { todayStr } from '../helpers';
import { Actions as AuthActions, Types as AuthTypes } from '../actions/Auth';
import { Actions as UserActions, Types as UserTypes } from '../actions/User';
import { Actions as PickupActions } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as MessageActions } from '../actions/Message';

const requestLoginAsync = (phoneNumber) => {
  const body = JSON.stringify({
    phoneNumber,
    android: Platform.OS === 'android',
  });
  const hmac = CryptoJS.HmacSHA1(body, 'secret').toString(CryptoJS.enc.Hex);

  return fetch(`https://${FBfunctions}/requestLogin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-signature': hmac,
    },
    body,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text();
      }
      throw response.status;
    });
};

const requestLogin = function* requestLogin(action) {
  try {
    yield put(MessageActions.showMessage('Requesting...', 0));
    const { phoneNumber } = action;
    const response = yield call(requestLoginAsync, phoneNumber);
    yield put(MessageActions.clearMessage());
    yield put(MessageActions.showMessage('Check your texts for your magic link', 4000));
    // TODO: remove this call
    if (phoneNumber.includes('111111111')) {
      yield put(MessageActions.clearMessage());
      yield put(AuthActions.login(response));
    }
  } catch (error) {
    console.log('requestLogin failed', error);
    yield put(MessageActions.showMessage('Magic link request failed', 2000));
  }
}

const watchRequestLogin = function* watchRequestLogin() {
  yield takeLatest(AuthTypes.REQUEST_LOGIN, requestLogin);
}

const loginAsync = (shortToken) => {
  return FBauth().signOut()
    .then(() => fetch(`https://${FBfunctions}/getLongToken?token=${shortToken}`))
    .then((response) => {
      if (response.status === 200) {
        return response.text();
      }
      throw "DANGER!";
    })
    .then((responseText) => {
      return FBauth().signInWithCustomToken(responseText);
    });
};

const getActivePickup = uid => FBref(`/pickups/${todayStr()}`)
  .orderByChild('requestor/uid').equalTo(uid).once('value')
  .then((snapshot) => {
    let pickup = null;
    snapshot.forEach((pickupSnapshot) => {
      pickup = pickupSnapshot.val();
      pickup.key = pickupSnapshot.key;
      if (!('completedAt' in pickup)) {
        pickup.students = Object.keys(pickup.students).map(key => (
          Object.assign({}, pickup.students[key], { key })
        ));
        // Returning true breaks the forEach loop
        return true;
      }
      pickup = null;
      return false;
    });
    return pickup;
  });

const logoutAsync = () => FBauth().signOut();

const getState = state => state;

const login = function* login() {
  while (true) {
    const { token } = yield take(AuthTypes.LOGIN);
    try {
      yield put(MessageActions.showMessage('Authenticating', 0));
      const user = yield call(loginAsync, token);
      yield put(AuthActions.setUser(user));
      yield put(UserActions.loadUser());
      yield take(UserTypes.LOADED);
    } catch (error) {
      console.log('Authentication failed', error);
      yield put(MessageActions.showMessage('Authentication failed', 1000));
      continue;
    }
    const state = yield select(getState);
    if (state.user.firstName === '') {
      yield put(MessageActions.clearMessage());
      yield put(NavActions.navigate('CreateProfile'));
    } else {
      yield put(MessageActions.clearMessage());
      const pickup = yield call(getActivePickup, state.auth.user.uid);
      yield put(PickupActions.loadPickup(pickup));
      yield put(NavActions.resetNavigation('Main'));
    }
    yield take(AuthTypes.LOGOUT);
    try {
      yield put(AuthActions.clear());
      yield put(NavActions.resetNavigation('Login'));
      yield call(logoutAsync);
    } catch (error) {
      // Do nothing
      console.log('Authentication failed', error);
    }
  }
}

const watchLogin = function* watchLogin() {
  yield fork(login);
}

const authSaga = function* authSaga() {
  yield all([
    watchRequestLogin(),
    watchLogin(),
  ]);
};

export default authSaga;
