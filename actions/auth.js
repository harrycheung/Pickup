
export const types = {
  LOAD_AUTH: 'Auth/LOAD_AUTH',
  LOGIN_REQUEST: 'Auth/LOGIN_REQUEST',
  LOGOUT: 'Auth/LOGOUT',
};

export const actions = {
  loadAuth: () => ({ type: types.LOAD_AUTH}),
  login: (phoneNumber) => ({ type: types.LOGIN_REQUEST, phoneNumber }),
  logout: () => ({ type: types.LOGOUT }),
}
