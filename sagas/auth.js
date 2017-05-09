
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';
import firebase from 'firebase';

import * as c from '../config/constants';
import { Types } from '../actions/Auth';
import { Types as UserTypes } from '../actions/User';
import { Types as StudentTypes } from '../actions/Student';
import { Actions as AuthActions } from '../actions/Auth';
import { Actions as UserActions } from '../actions/User';
import { Actions as StudentActions } from '../actions/Student';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';

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

const loginAsync = (token) => {
  return firebase.auth().signInWithCustomToken(token);
};

export function* login(action) {
  try {
    yield put(SpinnerActions.start());
    const user = yield call(loginAsync, action.token);
    yield put(AuthActions.loginSucceeded(user));
    yield put(UserActions.loadUser());
    yield take(UserTypes.LOADED);
    const state = yield select();
    if (state.user.firstName === '') {
      yield put(NavActions.navigate('CreateProfile'));
    } else {
      yield put(StudentActions.loadStudents(state.user.uid));
      yield take(StudentTypes.LOADED);
      yield put(NavActions.resetNavigation('Main'));
    }
  } catch (error) {
    console.log('login failed', error);
    yield put(AuthActions.loginFailed());
  } finally {
    yield put(SpinnerActions.stop());
  }
}

export function* watchLogin() {
  yield takeLatest(Types.LOGIN, login);
}

const logoutAsync = () => {
  return firebase.auth().signOut();
};

export function* logout() {
  try {
    yield call(logoutAsync);
    yield put(AuthActions.logoutSucceeded());
    yield put(NavActions.resetNavigation('LoginRequest'));
  } catch (error) {
    console.log('logout failed', error);
    yield put(AuthActions.logoutFailed());
  }
}

export function* watchLogout() {
  yield takeLatest(Types.LOGOUT, logout);
}
