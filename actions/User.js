
// @flow

export const Types = {
  LOAD: 'User/LOAD',
  LOADED: 'User/LOADED',
  SET: 'User/SET',
  CREATE: 'User/CREATE',
  UPDATE: 'User/UPDATE',
};

export const Actions = {
  loadUser: (uid: string) => ({type: Types.LOAD, uid}),
  loadedUser: () => ({type: Types.LOADED}),
  setUser: (firstName: string, lastInitial: string, admin: boolean) => ({
    type: Types.SET, firstName, lastInitial, admin
  }),
  createUser: (firstName: string, lastInitial: string) => ({
    type: Types.CREATE, firstName, lastInitial
  }),
  updateUser: (firstName: string, lastInitial: string) => ({
    type: Types.UPDATE, firstName, lastInitial
  }),
}
