
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';
import firebase from 'firebase';

import * as c from '../config/constants';
import { Types } from '../actions/Auth';
import { Actions as AuthActions } from '../actions/Auth';
import { Actions as DataActions } from '../actions/Data';
import { Actions as NavActions } from '../actions/Navigation';

export function* loadAuth() {
  yield take(Types.LOAD_AUTH);
  try {
    const state = yield select();
    if (state.auth.user != null) {
      yield put(NavActions.resetNavigation('Main'));
    } else {
      yield put(NavActions.resetNavigation('Login'));
    }
  } catch (error) {
    console.log('loadAuth failed');
    yield put(NavActions.resetNavigation('Login'));
  }
}

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
    if (response.status == 200) {
      return response.text();
    } else {
      throw response;
    }
  });
};

export function* requestLogin(action) {
  try {
    const { phoneNumber } = action;
    yield put(NavActions.navigate('LoginRequest', {phoneNumber}));
    const response = yield call(requestLoginAsync, phoneNumber);
    yield put(AuthActions.requestLoginSucceeded());
    // TODO: remove this call
    yield call(login, {token: response});
  } catch (error) {
    console.log('requestLogin failed', error);
    yield put(AuthActions.requestLoginFailed());
  }
}

export function* watchRequestLogin() {
  yield takeLatest(Types.REQUEST_LOGIN, requestLogin);
}

firebase.initializeApp(c.FirebaseConfig);

const loginAsync = (token) => {
  return firebase.auth().signInWithCustomToken(token);
};

// TODO: move this to data saga
const fetchStudents = (uid) => {
  return firebase.database().ref('/users/' + uid + '/students').once('value')
    .then((snapshot) => {
      const students = snapshot.val() == null ? {} : snapshot.val();
      const studentKeys = Object.keys(students);
      return Promise.all(
        studentKeys.map((id) => {
          return firebase.database().ref('/students/' + id).once('value')
            .then((snapshot) => {
              return Object.assign({}, snapshot.val(), {
                key: id,
                relationship: students[id],
              });
            });
        })
      );
    });
}

export function* login(action) {
  try {
    const user = yield call(loginAsync, action.token);
    yield put(AuthActions.loginSucceeded(user));
    const students = yield call(fetchStudents, user.uid);
    yield put(DataActions.loadStudents(students));
    yield put(NavActions.resetNavigation('Main'));
  } catch (error) {
    console.log('login failed', error);
    yield put(AuthActions.loginFailed());
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
    yield put(NavActions.resetNavigation('Login'));
  } catch (error) {
    console.log('logout failed', error);
    yield put(AuthActions.logoutFailed());
  }
}

export function* watchLogout() {
  console.log('watchlogout');
  yield takeLatest(Types.LOGOUT, logout);
}
