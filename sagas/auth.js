
import { delay } from 'redux-saga'
import { take, call, put, select } from 'redux-saga/effects';

import { FBFunctions, LoginKey } from '../config/constants';
import { types } from '../actions/auth';
import { actions as navActions } from '../actions/navigation';
import { actions as authActions } from '../actions/auth';

const requestLoginAsync = (phoneNumber) => {
  return fetch('https://' + FBFunctions + '/requestLogin?phoneNumber=' + phoneNumber);
};

export function* loadAuth() {
  yield take(types.LOAD_AUTH);
  try {
    const loginKey = yield call(AsyncStorage.getItem(LoginKey));
    yield put(navActions.resetNavigation('Main'));
  } catch (error) {
    yield put(navActions.resetNavigation('Login'));
  }
}

export function* requestLogin() {
  while(true) {
    try {
      yield take(types.LOGIN_REQUEST);
      const state = yield select();
      // const response = yield call(requestLoginAsync, state.auth.phoneNumber);
      yield delay(2000);
      const response = {name: 'Harry'};
      console.log('response', response);
      yield put(authActions.loginRequestSucceeded(response));
    } catch (error) {
      console.log('requestLogin failed', error);
      yield put(authActions.loginRequestFailed());
    }
  }
}

export function* authenticate() {
  while(true) {
    try {
      yield take(types.AUTHENTICATE);
    } catch (error) {
      
    }
  }
}

export function* logout() {

}
