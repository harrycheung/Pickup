
import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';
import firebase from 'firebase';

import * as c from '../config/constants';
import { types } from '../actions/auth';
import { actions as navActions } from '../actions/navigation';
import { actions as authActions } from '../actions/auth';
import { actions as dataActions } from '../actions/data';

export function* loadAuth() {
  yield take(types.LOAD_AUTH);
  try {
    const state = yield select();
    if (state.auth.user != null) {
      yield put(navActions.resetNavigation('Main'));
    } else {
      yield put(navActions.resetNavigation('Login'));
    }
  } catch (error) {
    console.log('loadAuth failed');
    yield put(navActions.resetNavigation('Login'));
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

export function* requestLogin() {
  try {
    const { auth } = yield select();
    const response = yield call(requestLoginAsync, auth.phoneNumber);
    yield put(authActions.requestLoginSucceeded());
    // TODO: remove this call
    yield call(login, {token: response});
  } catch (error) {
    console.log('requestLogin failed', error);
    yield put(authActions.requestLoginFailed());
  }
}

export function* watchRequestLogin() {
  yield takeLatest(types.REQUEST_LOGIN, requestLogin);
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
    yield put(authActions.loginSucceeded(user));
    const students = yield call(fetchStudents, user.uid);
    yield put(dataActions.loadStudents(students));
    yield put(navActions.resetNavigation('Main'));
  } catch (error) {
    console.log('login failed', error);
    // Do nothing?
  }
}

export function* watchLogin() {
  yield takeLatest(types.LOGIN, login);
}

const logoutAsync = () => {
  return firebase.auth().signOut();
};

export function* logout() {
  try {
    yield call(logoutAsync);
  } catch (error) {
    console.log('logout failed', error);
  }
}

export function* watchLogout() {
  yield takeLatest(types.LOGOUT, logout);
}
