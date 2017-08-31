
// @flow

import { all, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';

import { FBref } from '../helpers/firebase';
import { firebaseChannel } from './helpers';
import { Types, Actions as StudentActions } from '../actions/Student';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as MessageActions } from '../actions/Message';

const loadStudentsAsync = relationships => Promise.all(
  Object.keys(relationships).map(key => (
    FBref(`/students/${key}`).once('value').then(studentSnapshot => (
      Object.assign({}, studentSnapshot.val(), {
        key,
        relationship: relationships[key],
      })
    ))
  )),
);

const listenStudents = function* listenStudents() {
  while (true) {
    try {
      const { uid } = yield take(Types.LISTEN_STUDENTS);
      const studentsChannel = firebaseChannel(`/users/${uid}/students`, 'value');
      const studentsListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          const relationships = snapshot.val() === null ? {} : snapshot.val();
          const students = yield call(loadStudentsAsync, relationships);
          yield put(StudentActions.setStudents(students));
        }
      };

      yield fork(studentsListener, studentsChannel);
      yield take(Types.UNLISTEN_STUDENTS);
      studentsChannel.close();
    } catch (error) {
      console.log('listenStudents failed', error);
    }
  }
}

const watchlistenStudents = function* watchlistenStudents() {
  yield fork(listenStudents);
}

const addStudentAsync = (uid, firstName, lastInitial, image, grade, relationship) => (
  FBref('/students').push().then((studentRef) => {
    const relationships = {};
    relationships[uid] = relationship;
    const student = {
      firstName,
      lastInitial,
      name: `${firstName} ${lastInitial}`,
      image,
      grade,
      relationships,
    };
    const studentUpdate = {};
    studentUpdate[`students/${studentRef.key}`] = student;
    studentUpdate[`users/${uid}/students/${studentRef.key}`] = relationship;
    return FBref('/').update(studentUpdate);
  })
);

const addStudent = function* addStudent(action) {
  try {
    const { firstName, lastInitial, image, grade, relationship } = action;
    const state = yield select();
    yield call(
      addStudentAsync,
      state.auth.user.uid,
      firstName,
      lastInitial,
      image,
      grade,
      relationship,
    );
    yield put(NavActions.back());
  } catch (error) {
    console.log('addStudent failed', error);
    // Do nothing?
  }
}

const watchAddStudent = function* watchAddStudent() {
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
    name: `${firstName} ${lastInitial}`,
    image,
    grade,
    relationships,
  };
  studentUpdate[`users/${uid}/students/${key}`] = relationship;
  return FBref('/').update(studentUpdate);
};

const editStudent = function* editStudent(action) {
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

const watchEditStudent = function* watchEditStudent() {
  yield takeEvery(Types.EDIT_STUDENT, editStudent);
}

const deleteStudentAsync = (uid, key) => {
  const studentUpdate = {};
  studentUpdate[`students/${key}`] = null;
  studentUpdate[`users/${uid}/students/${key}`] = null;
  return FBref('/').update(studentUpdate);
};

const deleteStudent = function* deleteStudent(action) {
  try {
    const state = yield select();
    yield call(deleteStudentAsync, state.auth.user.uid, action.studentKey);
    yield put(NavActions.back());
  } catch (error) {
    console.log('deleteStudent failed', error);
    // Do nothing?
  }
}

const watchDeleteStudent = function* watchDeleteStudent() {
  yield takeEvery(Types.DELETE_STUDENT, deleteStudent);
}

const addRelationshipAsync = (studentKey, uid, relationship) => (
  FBref(`/users/${uid}`).once('value').then((snapshot) => {
    const user = snapshot.val();

    if (user === null) {
      return null;
    }

    const update = {};
    update[`/users/${uid}/students/${studentKey}`] = relationship;
    update[`/students/${studentKey}/relationships/${uid}`] = {
      name: user.name,
      role: relationship,
      image: user.image,
    };
    return FBref().update(update).then(() => ({ name: user.name, image: user.image }));
  })
);

const addRelationship = function* addRelationship(action) {
  try {
    const { studentKey, uid, relationship } = action;
    const result = yield call(addRelationshipAsync, studentKey, uid, relationship);
    if (result) {
      yield put(StudentActions.updateRelationship(studentKey, uid, {
        ...result,
        role: relationship,
      }));
    } else {
      yield put(MessageActions.showMessage('Phone number has\'t signed up', 3000));
    }
  } catch (error) {
    console.log('addRelationship failed', error);
  }
}

const watchAddRelationship = function* watchAddRelationship() {
  yield takeEvery(Types.ADD_RELATIONSHIP, addRelationship);
}

const removeRelationshipAsync = (studentKey, uid) => {
  const updates = {};
  updates[`/students/${studentKey}/relationships/${uid}`] = null;
  updates[`/users/${uid}/students/${studentKey}`] = null;
  return FBref().update(updates);
};

const removeRelationship = function* removeRelationship(action) {
  try {
    const { studentKey, uid } = action;
    yield call(removeRelationshipAsync, studentKey, uid);
    yield put(StudentActions.updateRelationship(studentKey, uid, null));
  } catch (error) {
    console.log('removeRelationship failed', error);
  }
}

const watchRemoveRelationship = function* watchRemoveRelationship() {
  yield takeEvery(Types.REMOVE_RELATIONSHIP, removeRelationship);
}

const studentSaga = function* studentSaga() {
  yield all([
    watchAddStudent(),
    watchEditStudent(),
    watchDeleteStudent(),
    watchAddRelationship(),
    watchlistenStudents(),
    watchRemoveRelationship(),
  ]);
};

export default studentSaga;
