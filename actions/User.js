
// @flow

export const Types = {
  LOAD: 'User/LOAD',
  SET: 'User/SET',
  CREATE: 'User/CREATE',
  UPDATE: 'User/UPDATE',
};

export const Actions = {
  loadUser: (uid: string) => ({type: Types.LOAD, uid}),
  setUser: (firstName: string, lastInitial: string) => ({
    type: Types.SET, firstName, lastInitial
  }),
  createUser: (firstName: string, lastInitial: string) => ({
    type: Types.CREATE, firstName, lastInitial
  }),
  updateUser: (firstName: string, lastInitial: string) => ({
    type: Types.UPDATE, firstName, lastInitial
  }),
}
