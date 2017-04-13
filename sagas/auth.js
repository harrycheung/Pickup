
import { take, call, put } from 'redux-saga/effects'

import constants from '../config/constants';
import { types } from '../actions/auth';
import { actions } from '../actions/navigation';

export function* loadAuth() {
  try {
    const loginKey = yield call(AsyncStorage.getItem(constants.LoginKey));
    yield put(actions.resetNavigation('Main'));
  } catch (error) {
    yield put(actions.resetNavigation('Login'));
  }
}
