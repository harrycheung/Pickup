
// @flow

export const Types = {
  LOAD: 'User/LOAD',
  LOADED: 'User/LOADED',
  SET: 'User/SET',
  CREATE: 'User/CREATE',
  UPDATE: 'User/UPDATE',
  UPDATE_IMAGE: 'User/UPDATE_IMAGE',
};

export const Actions = {
  loadUser: (uid?: string) => ({ type: Types.LOAD, uid }),
  loadedUser: () => ({ type: Types.LOADED }),
  setUser: (uid: string, firstName: string, lastInitial: string, image: string, admin: boolean) => ({
    type: Types.SET, uid, firstName, lastInitial, image, admin,
  }),
  createUser: (firstName: string, lastInitial: string, imageURL: string) => ({
    type: Types.CREATE, firstName, lastInitial, image: imageURL,
  }),
  updateUser: (firstName: string, lastInitial: string, imageURL: string) => ({
    type: Types.UPDATE, firstName, lastInitial, image: imageURL,
  }),
  updateImage: (image: string) => ({ type: Types.UPDATE_IMAGE, image }),
};
