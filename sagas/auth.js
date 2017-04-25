
import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';

import constants from '../config/constants';
import { types } from '../actions/auth';
import { actions as navActions } from '../actions/navigation';
import { actions as authActions } from '../actions/auth';
import { actions as dataActions } from '../actions/data';

const requestLoginAsync = (phoneNumber) => {
  const body = JSON.stringify({phoneNumber});
  const hmac = CryptoJS.HmacSHA1(body, 'secret').toString(CryptoJS.enc.Hex);

  return fetch('https://' + constants.FBFunctions + '/requestLogin', {
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
      return response.json();
    } else {
      throw response;
    }
  });
};

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

export function* requestLogin() {
  while (true) {
    try {
      yield take(types.REQUEST_LOGIN);
      const { auth } = yield select();
      const response = yield call(requestLoginAsync, auth.phoneNumber);
      yield put(authActions.requestLoginSucceeded(response));
    } catch (error) {
      console.log('requestLogin failed', error);
      yield put(authActions.requestLoginFailed());
    }
  }
}

export function* login(action) {
  try {
    // const response = yield call(loginAsync, action.token);
    // if (response.status == 200) {
      const user = { name: 'Harry' };
      yield put(authActions.loginSucceeded(user));
      const students = [
        {key: 'a', firstName: 'Max', lastInitial: 'C', image: {url: '../../images/max.png'}, grade: 'L1'},
        {key: 'b', firstName: 'Josh', lastInitial: 'B', image: {url: '../../images/max.png'}, grade: 'L1'},
        {key: 'c', firstName: 'Sam', lastInitial: 'P', image: {url: '../../images/max.png'}, grade: 'L1'}
      ];
      yield put(dataActions.loadStudents(students));
      yield put(navActions.resetNavigation('Main'));
    // }
  } catch (error) {
    console.log('login failed', error);
    // Do nothing?
  }
}

export function* watchLogin() {
  yield takeLatest(types.LOGIN, login);
}
