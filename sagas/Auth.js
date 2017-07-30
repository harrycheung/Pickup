
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';
import firebase from 'firebase';

import * as c from '../config/constants';
import { fbref } from '../helpers';
import { Types } from '../actions/Auth';
import { Types as UserTypes } from '../actions/User';
import { Types as StudentTypes } from '../actions/Student';
import { Types as PickupTypes } from '../actions/Pickup';
import { Actions as AuthActions } from '../actions/Auth';
import { Actions as UserActions } from '../actions/User';
import { Actions as StudentActions } from '../actions/Student';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';
import { Actions as PickupActions } from '../actions/Pickup';

const requestLoginAsync = (phoneNumber) => {
  const body = JSON.stringify({phoneNumber});
  const hmac = CryptoJS.HmacSHA1(body, 'secret').toString(CryptoJS.enc.Hex);

  return fetch('https://' + c.FirebaseFunctions + '/requestLogin', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-signature': hmac,
    },
    body: JSON.stringify({phoneNumber}),
  })
  .then((response) => {
    if (response.status === 200) {
      return response.text();
    } else {
      throw response;
    }
  });
};

export function* requestLogin(action) {
  try {
    yield put(SpinnerActions.start());
    const { phoneNumber } = action;
    const response = yield call(requestLoginAsync, phoneNumber);
    yield put(AuthActions.requestLoginSucceeded());
    // TODO: remove this call
    yield put(NavActions.navigate('Login', {token: response}));
  } catch (error) {
    console.log('requestLogin failed', error);
    yield put(AuthActions.requestLoginFailed());
  } finally {
    yield put(SpinnerActions.stop());
  }
}

export function* watchRequestLogin() {
  yield takeLatest(Types.REQUEST_LOGIN, requestLogin);
}

firebase.initializeApp(c.FirebaseConfig);

export const loginAsync = (token) => {
  return firebase.auth().signInWithCustomToken(token);
};

export const getActivePickup = (uid) => {
  return fbref('/pickups')
  .orderByChild('requestor').equalTo(uid).limitToFirst(1).once('value')
  .then((snapshot) => {
    let pickup = null;
    snapshot.forEach((pickupSnapshot) => {
      pickup = pickupSnapshot.val();
      pickup.key = pickupSnapshot.key;
      let students = [];
      for (let studentKey in pickup.students) {
        students.push(Object.assign({}, pickup.students[studentKey], {key: studentKey}));
      }
      pickup.students = students;
    });
    return pickup;
  });
};

const logoutAsync = () => {
  return firebase.auth().signOut();
};

export const getState = state => state;

export function* login() {
  while (true) {
    const { token } = yield take(Types.LOGIN);
    try {
      try {
        yield put(SpinnerActions.start());
        const user = yield call(loginAsync, token);
        yield put(AuthActions.loginSucceeded(user));
        yield put(UserActions.loadUser());
        yield take(UserTypes.LOADED);
        const state = yield select(getState);
        if (state.user.firstName === '') {
          yield put(NavActions.navigate('CreateProfile'));
        } else {
          yield put(StudentActions.loadStudents(state.auth.user.uid));
          yield take(StudentTypes.LOADED);
          const pickup = yield call(getActivePickup, state.auth.user.uid);
          yield put(PickupActions.loadPickup(pickup));
          yield put(NavActions.resetNavigation('Main'));
        }
      } finally {
        yield put(SpinnerActions.stop());
      }
      yield take(Types.LOGOUT);
      try {
        yield put(SpinnerActions.start());
        yield call(logoutAsync);
        yield put(AuthActions.logoutSucceeded());
        yield put(NavActions.resetNavigation('LoginRequest'));
      } finally {
        yield put(SpinnerActions.stop());
      }
    } catch (error) {
      console.log('login failed', error);
      yield put(AuthActions.loginFailed());
    }
  }
}

export function* watchLogin() {
  yield fork(login);
}
