
export const types = {
  LOAD_AUTH: 'Auth/LOAD_AUTH',
  LOGIN_REQUEST: 'Auth/LOGIN_REQUEST',
  LOGIN_REQUEST_FAILED: 'Auth/LOGIN_REQUEST_FAILED',
  LOGIN_REQUEST_SUCCEEDED: 'Auth/LOGIN_REQUEST_SUCCEEDED',
  LOGOUT: 'Auth/LOGOUT',
};

export const actions = {
  loadAuth: () => ({ type: types.LOAD_AUTH}),
  login: (phoneNumber) => ({ type: types.LOGIN_REQUEST, phoneNumber }),
  loginRequestSucceeded: (user) => ({ type: types.LOGIN_REQUEST_SUCCEEDED, user }),
  loginRequestFailed: () => ({ type: types.LOGIN_REQUEST_FAILED }),
  logout: () => ({ type: types.LOGOUT }),
}
