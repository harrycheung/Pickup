
// @flow

import { all, call, fork, put, take } from 'redux-saga/effects';

import { guid } from '../helpers';
import { FBfunctions, FBstorageRef } from '../helpers/firebase';
import { Types, Actions } from '../actions/Image';
import { Actions as MessageActions } from '../actions/Message';

const uploadImageAsync = (uri: string) => {
  const filename = guid();
  const body = new FormData();
  body.append('image', {
    uri,
    name: filename,
    type: 'image/jpeg',
  });
  return fetch(`https://${FBfunctions}/api/uploadImage`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body,
  })
    .then((response) => {
      if (response.status === 200) {
        return filename;
      }
      throw response.status;
    });
};

const uploadImage = function* uploadImage() {
  while (true) {
    try {
      const { imageData } = yield take(Types.UPLOAD);
      yield put(MessageActions.showMessage('Uploading...', 0));
      const image = yield call(uploadImageAsync, imageData);
      yield put(MessageActions.showMessage('Finished', 1000));
      yield put(Actions.setImage(image));
    } catch (error) {
      console.log('uploadImage error', error);
      yield put(MessageActions.showMessage('Error uploading. Please try again', 5000));
    }
  }
}

const watchUploadImage = function* watchUploadImage() {
  yield fork(uploadImage);
}

const imageSaga = function* imageSaga() {
  yield all([
    watchUploadImage(),
  ]);
};

export default imageSaga;
