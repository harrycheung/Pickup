
// @flow

export const Types = {
  REQUEST_LOGIN: 'Auth/REQUEST_LOGIN',
  REQUEST_LOGIN_SUCCEEDED: 'Auth/REQUEST_LOGIN_SUCCEEDED',
  LOGIN: 'Auth/LOGIN',
  LOGOUT: 'Auth/LOGOUT',
  SET_USER: 'Auth/SET_USER',
  CLEAR: 'Auth/CLEAR',
};

export const Actions = {
  requestLogin: (phoneNumber: string) => ({ type: Types.REQUEST_LOGIN, phoneNumber }),
  requestLoginSucceeded: () => ({ type: Types.REQUEST_LOGIN_SUCCEEDED }),
  login: (token: string) => ({ type: Types.LOGIN, token }),
  logout: () => ({ type: Types.LOGOUT }),
  setUser: (user: Object) => ({ type: Types.SET_USER, user }),
  clear: () => ({ type: Types.CLEAR }),
};
