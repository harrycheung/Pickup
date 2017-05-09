
// @flow

import { delay } from 'redux-saga'; // TODO: remove
import { call, put, select, takeEvery } from 'redux-saga/effects';
import firebase from 'firebase';

import { Types } from '../actions/Student';
import { Actions as StudentActions } from '../actions/Student';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as SpinnerActions } from '../actions/Spinner';

const loadStudentsAsync = (uid) => {
  return firebase.database().ref('/users/' + uid + '/students').once('value')
    .then((snapshot) => {
      const students = snapshot.val() === null ? {} : snapshot.val();
      const studentKeys = Object.keys(students);
      return Promise.all(
        studentKeys.map((id) => {
          return firebase.database().ref('/students/' + id).once('value')
            .then((snapshot) => {
              return Object.assign({}, snapshot.val(), {
                key: id,
                relationship: students[id],
              });
            });
        })
      );
    });
}

// Don't need spinner
export function* loadStudents(action) {
  try {
    const state = yield select();
    const students = yield call(loadStudentsAsync, state.auth.user.uid);
    yield put(StudentActions.setStudents(students));
    yield put(StudentActions.loadedStudents());
  } catch (error) {
    console.log('loadStudents failed', error);
    // Do nothing?
  }
}

export function* watchLoadStudents() {
  yield takeEvery(Types.LOAD, loadStudents);
}

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
    yield put(StudentActions.addStudentSucceeded({
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
    yield put(StudentActions.editStudentSucceeded(action.student));
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
    yield put(StudentActions.deleteStudentSucceeded(action.studentKey));
    yield put(NavActions.back());
  } catch (error) {
    console.log('deleteStudent failed', error);
    // Do nothing?
  }
}

export function* watchDeleteStudent() {
  yield takeEvery(Types.DELETE_STUDENT, deleteStudent);
}
