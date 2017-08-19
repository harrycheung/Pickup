
// @flow

export const Types = {
  LOAD: 'User/LOAD',
  LOADED: 'User/LOADED',
  SET: 'User/SET',
  CREATE: 'User/CREATE',
  UPDATE: 'User/UPDATE',
  UPDATE_IMAGE: 'User/UPDATE_IMAGE',
  ADD_VEHICLE: 'User/ADD_VEHICLE',
  REMOVE_VEHICLE: 'User/REMOVE_VEHICLE',
};

export const Actions = {
  loadUser: (uid?: string) => ({ type: Types.LOAD, uid }),
  loadedUser: () => ({ type: Types.LOADED }),
  setUser: (uid: string, user: Object) => ({
    type: Types.SET, uid, user,
  }),
  createUser: (firstName: string, lastInitial: string, imageURL: string) => ({
    type: Types.CREATE, firstName, lastInitial, image: imageURL,
  }),
  updateUser: (firstName: string, lastInitial: string, imageURL: string) => ({
    type: Types.UPDATE, firstName, lastInitial, image: imageURL,
  }),
  updateImage: (image: string) => ({ type: Types.UPDATE_IMAGE, image }),
  addVehicle: (vehicle: string) => ({ type: Types.ADD_VEHICLE, vehicle }),
  removeVehicle: (vehicle: string) => ({ type: Types.REMOVE_VEHICLE, vehicle }),
};
