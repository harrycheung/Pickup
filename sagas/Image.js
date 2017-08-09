
// @flow

import { call, fork, put, take } from 'redux-saga/effects';

import { guid, convertToByteArray } from '../helpers';
import { FBstorageRef } from '../helpers/firebase';
import { Types, Actions } from '../actions/Image';

// const _uploadAsByteArray = async (pickerResultAsByteArray, progressCallback?) => {
//   try {
//     const metadata = {
//       contentType: 'image/jpeg',
//     };
//
//     const photoRef = FBstorageRef().child(`images/${guid()}`);
//     const uploadTask = photoRef.put(pickerResultAsByteArray, metadata);
//     uploadTask.on('state_changed', (snapshot) => {
//       progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes);
//
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log(`Upload is ${progress}% done`);
//     }, (error) => {
//       console.log('in _uploadAsByteArray ', error);
//     }, () => {
//       console.log('_uploadAsByteArray ', uploadTask.snapshot.downloadURL);
//     });
//   } catch (ee) {
//     console.log('when trying to load _uploadAsByteArray ', ee);
//   }
// };
//

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

export function* watchUploadImage() {
  yield fork(uploadImage);
}
