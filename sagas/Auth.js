
// @flow

import { all, call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';

import { FBauth, FBref, FBfunctions } from '../helpers/firebase';
import { Actions as AuthActions, Types as AuthTypes } from '../actions/Auth';
import { Actions as UserActions, Types as UserTypes } from '../actions/User';
import { Actions as StudentActions, Types as StudentTypes } from '../actions/Student';
import { Actions as PickupActions } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';
import { Actions as MessageActions } from '../actions/Message';

const requestLoginAsync = (phoneNumber) => {
  const body = JSON.stringify({ phoneNumber });
  const hmac = CryptoJS.HmacSHA1(body, 'secret').toString(CryptoJS.enc.Hex);

  return fetch(`https://${FBfunctions}/requestLogin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-signature': hmac,
    },
    body: JSON.stringify({ phoneNumber }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text();
      }
      throw response;
    });
};

function* requestLogin(action) {
  try {
    yield put(MessageActions.showMessage('Requesting...', 0));
    const { phoneNumber } = action;
    const response = yield call(requestLoginAsync, phoneNumber);
    yield put(AuthActions.requestLoginSucceeded());
    // TODO: remove this call
    yield put(NavActions.resetNavigation('Login', { token: response }));
  } catch (error) {
    console.log('requestLogin failed', error);
    yield put(AuthActions.authFailure());
  } finally {
    yield put(MessageActions.clearMessage());
  }
}

function* watchRequestLogin() {
  yield takeLatest(AuthTypes.REQUEST_LOGIN, requestLogin);
}

const loginAsync = token => FBauth.signInWithCustomToken(token);

const getActivePickup = uid => FBref('/pickups')
  .orderByChild('requestor/uid').equalTo(uid).once('value')
  .then((snapshot) => {
    let pickup = null;
    snapshot.forEach((pickupSnapshot) => {
      pickup = pickupSnapshot.val();
      pickup.key = pickupSnapshot.key;
      if (!('completedAt' in pickup)) {
        const students = [];
        Object.keys(pickup.students).forEach((key) => {
          students.push(Object.assign(pickup.students[key], { key }));
        });
        pickup.students = students;
        // Returning true breaks the forEach loop
        return true;
      }
      return false;
    });
    return pickup;
  });

const logoutAsync = () => FBauth.signOut();

const getState = state => state;

function* login() {
  while (true) {
    const { token } = yield take(AuthTypes.LOGIN);
    try {
      try {
        yield put(SpinnerActions.start());
        const user = yield call(loginAsync, token);
        yield put(AuthActions.setUser(user));
        yield put(UserActions.loadUser());
        yield take(UserTypes.LOADED);
        const state = yield select(getState);
        if (state.user.firstName === '') {
          yield put(NavActions.navigate('CreateProfile'));
        } else {
          const pickup = yield call(getActivePickup, state.auth.user.uid);
          yield put(PickupActions.loadPickup(pickup));
          yield put(NavActions.resetNavigation('Main'));
        }
      } finally {
        yield put(SpinnerActions.stop());
      }
      yield take(AuthTypes.LOGOUT);
      yield call(logoutAsync);
      yield put(AuthActions.clear());
      yield put(NavActions.resetNavigation('LoginRequest'));
    } catch (error) {
      console.log('Authentication failed', error);
      yield put(AuthActions.authFailure());
      yield put(AuthActions.clear());
      yield put(NavActions.resetNavigation('LoginRequest'));
    }
  }
}

function* logout() {
  yield take(AuthTypes.LOGOUT);
  yield call(logoutAsync);
  yield put(AuthActions.clear());
  yield put(NavActions.resetNavigation('LoginRequest'));
}

function* watchLogin() {
  yield fork(login);
  yield fork(logout); // TODO: take out
}

export default function* authSaga() {
  yield all([
    watchRequestLogin(),
    watchLogin(),
  ]);
}
