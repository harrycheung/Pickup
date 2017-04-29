
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, takeEvery } from 'redux-saga/effects';
import firebase from 'firebase';

import { Types } from '../actions/Data';
import { Actions as DataActions } from '../actions/Data';
import { Actions as NavActions } from '../actions/Navigation';

const addStudentAsync = (uid, firstName, lastInitial, grade, relationship) => {
  return firebase.database().ref('/students').push()
    .then((studentRef) => {
      var relationships = {};
      relationships[uid] = relationship;
      var studentUpdate = {};
      studentUpdate['students/' + studentRef.key] = {
        firstName,
        lastInitial,
        grade,
        relationships,
      };
      studentUpdate['users/' + uid + '/students/' + studentRef.key] = relationship;
      return firebase.database().ref('/').update(studentUpdate).then(() => {
        return studentRef.key;
      });
    });
};

export function* addStudent(action) {
  try {
    const { firstName, lastInitial, grade, relationship } = action;
    const state = yield select();
    const studentKey = yield call(
      addStudentAsync,
      state.auth.user.uid,
      firstName,
      lastInitial,
      grade,
      relationship
    );
    yield put(DataActions.addStudentSucceeded({
      key: studentKey, firstName, lastInitial, grade, relationship
    }));
    yield put(NavActions.back());
  } catch (error) {
    console.log('addStudent failed', error);
    // Do nothing?
  }
}

export function* watchAddStudent() {
  yield takeEvery(Types.ADD_STUDENT, addStudent);
}

const editStudentAsync = (uid, student) => {
  const { key, firstName, lastInitial, grade, relationship } = student;
  var relationships = {};
  relationships[uid] = relationship;
  var studentUpdate = {};
  studentUpdate['students/' + key] = {
    firstName,
    lastInitial,
    grade,
    relationships,
  };
  studentUpdate['users/' + uid + '/students/' + key] = relationship;
  return firebase.database().ref('/').update(studentUpdate);
};

export function* editStudent(action) {
  try {
    const state = yield select();
    yield call(editStudentAsync, state.auth.user.uid, action.student);
    yield put(DataActions.editStudentSucceeded(action.student));
    yield put(NavActions.back());
  } catch (error) {
    console.log('editStudent failed', error);
    // Do nothing?
  }
}

export function* watchEditStudent() {
  yield takeEvery(Types.EDIT_STUDENT, editStudent);
}

const deleteStudentAsync = (uid, key) => {
  var studentUpdate = {};
  studentUpdate['students/' + key] = null;
  studentUpdate['users/' + uid + '/students/' + key] = null;
  return firebase.database().ref('/').update(studentUpdate);
};

export function* deleteStudent(action) {
  try {
    const state = yield select();
    yield call(deleteStudentAsync, state.auth.user.uid, action.studentKey);
    yield put(DataActions.deleteStudentSucceeded(action.studentKey));
    yield put(NavActions.back());
  } catch (error) {
    console.log('deleteStudent failed', error);
    // Do nothing?
  }
}

export function* watchDeleteStudent() {
  yield takeEvery(Types.DELETE_STUDENT, deleteStudent);
}

export function* pickup(action) {
  try {
    yield put(NavActions.navigate('AwaitingPickup'));
  } catch (error) {
    console.log('pickup failed', error);
  }
}

export function* watchPickup(action) {
  yield takeEvery(Types.PICKUP, pickup);
}
