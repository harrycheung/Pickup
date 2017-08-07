
// @flow

import Cache from './cache';

export const merge = (a: Object, b: Object) => {
  return Object.assign({}, a, b);
};

export const fullName = (user: {firstName: string, lastInitial: string}) => {
  return `${user.firstName} ${user.lastInitial}`;
};

export const time = (timestamp: number) => {
  return (new Date(timestamp)).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
};

export const truncate = (str: string, n: number) => {
  return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
};

export const StudentCache = new Cache('students');
export const PickupCache = new Cache('pickups');
