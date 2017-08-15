
// @flow

import { all, call, fork, put, take } from 'redux-saga/effects';

import { guid, convertToByteArray } from '../helpers';
import { FBstorageRef } from '../helpers/firebase';
import { Types, Actions } from '../actions/Image';

const uploadImageAsync = (imageData: string) => {
  const bytes = convertToByteArray(imageData);
  const photoRef = FBstorageRef().child(`images/${guid()}`);
  const uploadTask = photoRef.put(bytes, { contentType: 'image/jpeg' });

  uploadTask.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  });

  return uploadTask.then(snapshot => snapshot.downloadURL, (error) => {
    throw error;
  });
};

function* uploadImage() {
  while (true) {
    try {
      const { imageData } = yield take(Types.UPLOAD);
      const imageURL = yield call(uploadImageAsync, imageData);
      yield put(Actions.setImage(imageURL));
    } catch (error) {
      console.log('uploadImage error', error);
    }
  }
}

function* watchUploadImage() {
  yield fork(uploadImage);
}

export default function* imageSaga() {
  yield all([
    watchUploadImage(),
  ]);
}
