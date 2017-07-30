
// @flow

import Cache from './cache';

export const merge = (a: Object, b: Object) => {
  return Object.assign({}, a, b);
};

export const fullName = (user: {firstName: string, lastInitial: string}) => {
  return `${user.firstName} ${user.lastInitial}`;
};

export const StudentCache = new Cache('students');
export const PickupCache = new Cache('pickups');
