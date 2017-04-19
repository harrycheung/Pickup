
import { delay } from 'redux-saga'
import { call, put, select, take, takeLatest } from 'redux-saga/effects';

import { FBFunctions, LoginKey } from '../config/constants';
import { types } from '../actions/auth';
import { actions as navActions } from '../actions/navigation';
import { actions as authActions } from '../actions/auth';
import { actions as dataActions } from '../actions/data';

const requestLoginAsync = (phoneNumber) => {
  return fetch('https://' + FBFunctions + '/requestLogin?phoneNumber=' + phoneNumber);
};

export function* loadAuth() {
  yield take(types.LOAD_AUTH);
  try {
    const state = yield select();
    if (state.auth.user != null) {
      yield put(navActions.resetNavigation('Home'));
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
      const state = yield select();
      // const response = yield call(requestLoginAsync, state.auth.phoneNumber);
      yield delay(500);
      yield put(authActions.requestLoginSucceeded());
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
        {key: 'a', name: 'Max C', image: {url: '../../images/max.png'}, grade: 'L1'},
        {key: 'b', name: 'Josh B', image: {url: '../../images/max.png'}, grade: 'L1'},
        {key: 'c', name: 'Sam P', image: {url: '../../images/max.png'}, grade: 'L1'}
      ];
      yield put(dataActions.loadStudents(students));
      yield put(navActions.resetNavigation('Home'));
    // }
  } catch (error) {
    console.log('login failed', error);
    // Do nothing?
  }
}

export function* watchLogin() {
  yield takeLatest(types.LOGIN, login);
}
