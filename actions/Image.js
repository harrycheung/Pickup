
// @flow

export const Types = {
  UPLOAD: 'Image/UPLOAD',
  SET: 'Image/SET',
  CLEAR: 'Image/CLEAR',
};

export const Actions = {
  uploadImage: (imageData: string) => ({ type: Types.UPLOAD, imageData }),
  setImage: (imageURL: string) => ({ type: Types.SET, imageURL }),
  clearImage: () => ({ type: Types.CLEAR }),
};
