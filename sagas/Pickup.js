
// @flow

import { call, put, takeEvery } from 'redux-saga/effects';

import { fbref } from '../helpers';
import { Types } from '../actions/Pickup';
import { Actions as PickupActions } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';
import { StudentCache } from '../helpers';

const createPickupAsync = (requestor, students) => {
  const pickupStudents = students.reduce((students, student) => {
    students[student.key] = {escort: ''};
    return students;
  }, {});
  const grades = Array.from(new Set(students.map((student) => student.grade)));
  let pickup = {
    requestor,
    students: pickupStudents,
    grades,
    createdAt: Date.now(),
  };
  fbref('/pickups').push(pickup).then((pickupRef) => {
    return pickupRef.child('messages').push({
      type: 'request',
      sender: requestor,
      createdAt: Date.now(),
    })
    .then((messageRef) => {
      return pickupRef;
    });
  })
  .then((pickupRef) => {
    pickup.key = pickupRef.key;
    pickup.students = students;
    return pickup;
  });
}

export function* createPickup(action) {
  try {
    const pickup = yield call(createPickupAsync, action.requestor, action.students);
    yield put(PickupActions.createdPickup(pickup));
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('createPickup failed', error);
    // Do nothing?
  }
}

export function* watchCreatePickup() {
  yield takeEvery(Types.CREATE, createPickup);
}

const cancelPickupAsync = (pickupKey) => {
  fbref('/pickups/' + pickupKey).remove();
};

export function* cancelPickup(action) {
  try {
    const pickup = yield call(cancelPickupAsync, action.pickup.key);
  } catch (error) {
    console.log('cancelPickup failed', error);
    // Do nothing?
  }
}

export function* watchCancelPickup() {
  yield takeEvery(Types.CANCEL, cancelPickup);
}

export function* loadPickup(action) {
  yield put(PickupActions.loadedPickup(pickup));
}

export function* watchLoadPickup() {
  yield takeEvery(Types.LOAD, loadPickup);
}

const loadStudentsAsync = (pickup) => {
  let students = [];
  for (let studentKey in pickup.students) {
    students.push(StudentCache.get(studentKey).then((student) => {
      student.key = studentKey;
      return student;
    }));
  }
  return Promise.all(students);
}

export function* resumePickup(action) {
  try {
    const students = yield call(loadStudentsAsync, action.pickup);
    yield put(NavActions.navigate('PickupRequest', {students}));
  } catch (error) {
    console.log('resumePickup failed', error);
  }
}

export function* watchResumePickup() {
  yield takeEvery(Types.RESUME, resumePickup);
}
