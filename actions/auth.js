
export const types = {
  LOGIN_REQUEST: 'Auth/LOGIN_REQUEST',
  LOGOUT: 'Auth/LOGOUT',
};

export const actions = {
  login: (phoneNumber) => ({ type: types.LOGIN_REQUEST, phoneNumber }),
  logout: () => ({ type: types.LOGOUT }),
}
