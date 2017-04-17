
export const types = {
  LOAD_AUTH: 'Auth/LOAD_AUTH',
  LOGIN_REQUEST: 'Auth/LOGIN_REQUEST',
  LOGIN_REQUEST_FAILED: 'Auth/LOGIN_REQUEST_FAILED',
  LOGIN_REQUEST_SUCCEEDED: 'Auth/LOGIN_REQUEST_SUCCEEDED',
  LOGIN: 'Auth/LOGIN',
  LOGOUT: 'Auth/LOGOUT',
};

export const actions = {
  loadAuth: () => ({type: types.LOAD_AUTH}),
  loginRequest: (phoneNumber) => ({type: types.LOGIN_REQUEST, phoneNumber}),
  loginRequestSucceeded: (user) => ({type: types.LOGIN_REQUEST_SUCCEEDED, user}),
  loginRequestFailed: () => ({type: types.LOGIN_REQUEST_FAILED}),
  login: (token) => ({type: types.LOGIN, token}),
  logout: () => ({type: types.LOGOUT}),
}
