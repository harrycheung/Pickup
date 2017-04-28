
// @flow

export const types = {
  LOAD_AUTH: 'Auth/LOAD_AUTH',
  REQUEST_LOGIN: 'Auth/REQUEST_LOGIN',
  REQUEST_LOGIN_FAILED: 'Auth/REQUEST_LOGIN_FAILED',
  REQUEST_LOGIN_SUCCEEDED: 'Auth/REQUEST_LOGIN_SUCCEEDED',
  LOGIN: 'Auth/LOGIN',
  LOGIN_SUCCEEDED: 'Auth/LOGIN_SUCCEEDED',
  LOGOUT: 'Auth/LOGOUT',
};

export const actions = {
  loadAuth: () => ({type: types.LOAD_AUTH}),
  requestLogin: (phoneNumber: string) => ({type: types.REQUEST_LOGIN, phoneNumber}),
  requestLoginSucceeded: () => ({type: types.REQUEST_LOGIN_SUCCEEDED}),
  requestLoginFailed: () => ({type: types.REQUEST_LOGIN_FAILED}),
  login: (token: string) => ({type: types.LOGIN, token}),
  loginSucceeded: (user: Object) => ({type: types.LOGIN_SUCCEEDED, user}),
  logout: () => ({type: types.LOGOUT}),
}
