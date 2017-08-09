
// @flow

import { call, put, select, takeEvery } from 'redux-saga/effects';

import { FBref } from '../helpers/firebase';
import { Types, Actions as StudentActions } from '../actions/Student';
import { Actions as NavActions } from '../actions/Navigation';

const loadStudentsAsync = uid => (
  FBref(`/users/${uid}/students`).once('value').then((snapshot) => {
    const students = snapshot.val() === null ? {} : snapshot.val();
    const studentKeys = Object.keys(students);
    return Promise.all(
      studentKeys.map(id => (
        FBref(`/students/${id}`).once('value').then(studentSnapshot => (
          Object.assign({}, studentSnapshot.val(), {
            key: id,
            relationship: students[id],
          })
        ))
      )),
    );
  })
);

// Don't need spinner
export function* loadStudents(action) {
  try {
    const students = yield call(loadStudentsAsync, action.uid);
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

const addStudentAsync = (uid, firstName, lastInitial, image, grade, relationship) => (
  FBref('/students').push().then((studentRef) => {
    const relationships = {};
    relationships[uid] = relationship;
    const studentUpdate = {};
    studentUpdate[`students/${studentRef.key}`] = {
      firstName,
      lastInitial,
      image,
      grade,
      relationships,
    };
    studentUpdate[`users/${uid}/students/${studentRef.key}`] = relationship;
    return FBref('/').update(studentUpdate).then(() => studentRef.key);
  })
);

export function* addStudent(action) {
  try {
    const { firstName, lastInitial, image, grade, relationship } = action;
    const state = yield select();
    const studentKey = yield call(
      addStudentAsync,
      state.auth.user.uid,
      firstName,
      lastInitial,
      image,
      grade,
      relationship,
    );
    yield put(StudentActions.addStudentSucceeded({
      key: studentKey, firstName, lastInitial, image, grade, relationship,
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
  const { key, firstName, lastInitial, image, grade, relationship } = student;
  const relationships = {};
  relationships[uid] = relationship;
  const studentUpdate = {};
  studentUpdate[`students/${key}`] = {
    firstName,
    lastInitial,
    image,
    grade,
    relationships,
  };
  studentUpdate[`users/${uid}/students/${key}`] = relationship;
  return FBref('/').update(studentUpdate);
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
  const studentUpdate = {};
  studentUpdate[`students/${key}`] = null;
  studentUpdate[`users/${uid}/students/${key}`] = null;
  return FBref('/').update(studentUpdate);
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
