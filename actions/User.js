
// @flow

export const Types = {
  LOAD: 'User/LOAD',
  UPDATE: 'User/UPDATE',
};

export const Actions = {
  loadUser: (uid: string) => ({type: Types.LOAD, uid}),
  setUser: (firstName: string, lastInitial: string) => ({
    type: Types.UPDATE, firstName, lastInitial
  }),
  updateUser: (firstName: string, lastInitial: string) => ({
    type: Types.UPDATE, firstName, lastInitial
  }),
}
