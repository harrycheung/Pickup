
// @flow

import { call, put, select, take } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Auth from '../Auth';
import { Actions as AuthActions, Types as AuthTypes } from '../../actions/Auth';
import { Actions as SpinnerActions } from '../../actions/Spinner';
import { Actions as UserActions, Types as UserTypes } from '../../actions/User';
import { Actions as NavActions } from '../../actions/Navigation';
import { Actions as StudentActions, Types as StudentTypes } from '../../actions/Student';
import { Actions as PickupActions } from '../../actions/Pickup';

const dummyToken = '38nasd;of9/jawlefma;so8f3ea;';
const dummyUser = {
  firstName: 'Dummy',
  lastInitial: 'U',
};
const newUserState = {user: {firstName: ''}};
const dummyUID = '1111';
const oldUserState = {user: dummyUser, auth: {user: {uid: dummyUID}}};
const dummyPickup = null;

describe('Auth login saga', () => {
  const gen = cloneableGenerator(Auth.login)();

  it('will take Auth/LOGIN action', () => {
    expect(gen.next().value).toEqual(take(AuthTypes.LOGIN));
  });

  it('will start spinner', () => {
    expect(gen.next(AuthActions.login(dummyToken)).value).toEqual(put(SpinnerActions.start()));
  });

  it('will login with firebase', () => {
    expect(gen.next().value).toEqual(call(Auth.loginAsync, dummyToken));
  });

  it('will put a successful login', () => {
    expect(gen.next(dummyUser).value).toEqual(put(AuthActions.setUser(dummyUser)));
  });

  it('will begin loading the user', () => {
    expect(gen.next().value).toEqual(put(UserActions.loadUser()));
  });

  it('will finish loading the user', () => {
    expect(gen.next().value).toEqual(take(UserTypes.LOADED));
  });

  it('get the user from the state', () => {
    expect(gen.next().value).toEqual(select(Auth.getState));
  });

  // describe('User is new', () => {
  //   let clone = gen.clone();
  //   it('will navigate to CreateProfile screen', () => {
  //     expect(clone.next(newUserState).value).toEqual(put(NavActions.navigate('CreateProfile')));
  //   });
  // });

  describe('User is logging back in', () => {
    it('will load students', () => {
      expect(gen.next(oldUserState).value).toEqual(put(StudentActions.loadStudents(dummyUID)));
    });

    it('will load students successfully', () => {
      expect(gen.next().value).toEqual(take(StudentTypes.LOADED));
    });

    it('will find a previous pickup', () => {
      expect(gen.next().value).toEqual(call(Auth.getActivePickup, dummyUID));
    });

    it('will load the pickup', () => {
      expect(gen.next(dummyPickup).value).toEqual(put(PickupActions.loadPickup(dummyPickup)));
    });

    it('navigate to home screen', () => {
      expect(gen.next().value).toEqual(put(NavActions.resetNavigation('Main')));
    });
  });

  it('will stop the spinner', () => {
    expect(gen.next().value).toEqual(put(SpinnerActions.stop()));
  });

  it('will take a LOGOUT', () => {
    expect(gen.next().value).toEqual(take(AuthTypes.LOGOUT));
  });
});
