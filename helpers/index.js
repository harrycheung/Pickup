
// @flow

import firebase from 'firebase';

import Cache from './cache';

export const merge = (a: Object, b: Object) => {
  return Object.assign({}, a, b);
};

export const fbref = (ref: string) => {
  return firebase.database().ref(ref);
};

export const fullName = (user) => `${user.firstName} ${user.lastInitial}`;

export const StudentCache = new Cache('students');
export const PickupCache = new Cache('pickups');
