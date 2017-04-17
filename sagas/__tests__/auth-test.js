
import { take } from 'redux-saga/effects';

import * as auth from '../auth';
import { types } from '../../actions/auth';

it('loadAuth succeeds', () => {
  const saga = auth.loadAuth();

  expect(saga.next().value).toEqual(take(types.LOAD_AUTH));
  // expect(saga.next().vaule).toEqual()
});

it('requestLogin succeeds', () => {
  const saga = auth.requestLogin();

  expect(saga.next().value).toEqual(take(types.LOGIN_REQUEST));  
});
