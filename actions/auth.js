
// @flow

export const Types = {
  REQUEST_LOGIN: 'Auth/REQUEST_LOGIN',
  REQUEST_LOGIN_SUCCEEDED: 'Auth/REQUEST_LOGIN_SUCCEEDED',
  REQUEST_LOGIN_FAILED: 'Auth/REQUEST_LOGIN_FAILED',
  LOGIN: 'Auth/LOGIN',
  LOGIN_SUCCEEDED: 'Auth/LOGIN_SUCCEEDED',
  LOGIN_FAILED: 'Auth/LOGIN_FAILED',
  LOGOUT: 'Auth/LOGOUT',
  LOGOUT_SUCCEEDED: 'Auth/LOGOUT_SUCCEEDED',
  LOGOUT_FAILED: 'Auth/LOGOUT_FAILED',
};

export const Actions = {
  requestLogin: (phoneNumber: string) => ({type: Types.REQUEST_LOGIN, phoneNumber}),
  requestLoginSucceeded: () => ({type: Types.REQUEST_LOGIN_SUCCEEDED}),
  requestLoginFailed: () => ({type: Types.REQUEST_LOGIN_FAILED}),
  login: (token: string) => ({type: Types.LOGIN, token}),
  loginSucceeded: (user: Object) => ({type: Types.LOGIN_SUCCEEDED, user}),
  loginFailed: () => ({type: Types.LOGIN_FAILED}),
  logout: () => ({type: Types.LOGOUT}),
  logoutSucceeded: () => ({type: Types.LOGOUT_SUCCEEDED}),
  logoutFailed: () => ({type: Types.LOGOUT_FAILED}),
}
