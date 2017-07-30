
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';

import { FBauth, FBref, FBfunctions } from '../helpers/firebase';
import { Actions as AuthActions, Types as AuthTypes} from '../actions/Auth';
import { Actions as UserActions, Types as UserTypes } from '../actions/User';
import { Actions as StudentActions, Types as StudentTypes } from '../actions/Student';
import { Actions as PickupActions, Types as PickupTypes } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';

const requestLoginAsync = (phoneNumber) => {
  const body = JSON.stringify({phoneNumber});
  const hmac = CryptoJS.HmacSHA1(body, 'secret').toString(CryptoJS.enc.Hex);

  return fetch('https://' + FBfunctions + '/requestLogin', {
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
    yield put(AuthActions.authFailure());
  } finally {
    yield put(SpinnerActions.stop());
  }
}

export function* watchRequestLogin() {
  yield takeLatest(AuthTypes.REQUEST_LOGIN, requestLogin);
}

export const loginAsync = (token) => {
  return FBauth.signInWithCustomToken(token);
};

export const getActivePickup = (uid) => {
  return FBref('/pickups')
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
  return FBauth.signOut();
};

export const getState = state => state;

export function* login() {
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
          yield put(StudentActions.loadStudents(state.auth.user.uid));
          yield take(StudentTypes.LOADED);
          const pickup = yield call(getActivePickup, state.auth.user.uid);
          yield put(PickupActions.loadPickup(pickup));
          yield put(NavActions.resetNavigation('Main'));
        }
      } finally {
        yield put(SpinnerActions.stop());
      }
      yield take(AuthTypes.LOGOUT);
      try {
        yield put(SpinnerActions.start());
        yield call(logoutAsync);
        yield put(AuthActions.clear());
        yield put(NavActions.resetNavigation('LoginRequest'));
      } finally {
        yield put(SpinnerActions.stop());
      }
    } catch (error) {
      console.log('Authentication failed', error);
      yield put(AuthActions.authFailure());
    }
  }
}

export function* watchLogin() {
  yield fork(login);
}
