
// @flow

export const merge = (a: Object, b: Object) => Object.assign({}, a, b);

export const fullName = (user: {firstName: string, lastInitial: string}) => (
  `${user.firstName} ${user.lastInitial}`
);

export const time = (timestamp: number) => (
  (new Date(timestamp))
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
);

export const truncate = (str: string, n: number) => (
  ((str.length > n) ? `${str.substr(0, n - 1)}&hellip;` : str)
);
