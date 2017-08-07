
// @flow

import { call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { FBref } from '../helpers/firebase';
import { fullName } from '../helpers';
import { Types } from '../actions/Pickup';
import { Actions as PickupActions } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';
import { StudentCache } from '../helpers';

const createPickupAsync = (requestor, students) => {
  const pickupStudents = students.reduce((students, student) => {
    students[student.key] = {
      key: student.key,
      name: fullName(student),
      escort: {uid: '', name: ''},
      released: false,
      grade: student.grade,
    };
    return students;
  }, {});
  const grades = students.reduce((acc, student) => {
    acc[student.grade] = true;
    return acc;
  }, {});
  requestor = { uid: requestor.uid, name: requestor.name };
  let pickup = {
    requestor,
    students: pickupStudents,
    grades,
    createdAt: Date.now(),
  };
  return FBref('/pickups').push(pickup).then((pickupRef) => {
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
    pickup.students = pickupStudents;
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
  FBref(`/pickups/${pickupKey}`).remove();
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
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('resumePickup failed', error);
  }
}

export function* watchResumePickup() {
  yield takeEvery(Types.RESUME, resumePickup);
}

export function* handlePickup(action) {
  try {
    yield put(NavActions.navigate('HandlePickup'));
  } catch (error) {
    console.log('handlePickup error', error);
  }
}

export function* watchHandlePickup() {
  yield takeEvery(Types.HANDLE, handlePickup);
}

export function* postMessage(action) {
  try {
    const { sender } = action;
    let messageData = {
      sender: {uid: sender.uid, name: sender.name},
      createdAt: Date.now(),
      ...action.message,
    };

    FBref(`/pickups/${action.pickup.key}/messages`).push(messageData);
  } catch (error) {
    console.log('postMessage failed', error);
  }
}

export function* watchPostMessage() {
  yield takeEvery(Types.POST_MESSAGE, postMessage);
}

const firebaseChannel = (path: string, eventType: string) => {
  return eventChannel((emitter) => {
    const ref = FBref(path);

    ref.on(eventType, (snapshot) => emitter(snapshot));

    return () => ref.off();
  });
};

export function* listenPickup() {
  while (true) {
    try {
      const { pickup } = yield take(Types.LISTEN);

      const pickupCancelChannel = firebaseChannel(`/pickups/${pickup.key}`, 'value');
      const pickupCancelListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          if (snapshot.val() === null) {
            yield put(NavActions.back());
            yield put(PickupActions.canceledPickup());
          }
        }
      };

      const pickupStudentsChannel = firebaseChannel(`/pickups/${pickup.key}/students`, 'value');
      const pickupStudentsListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          yield put(PickupActions.updateStudents(snapshot.val()));
        }
      }

      const pickupMessagesChannel = firebaseChannel(`/pickups/${pickup.key}/messages`, 'value');
      const pickupMessagesListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          yield put(PickupActions.updateMessages(snapshot.val()));
        }
      }

      yield fork(pickupCancelListener, pickupCancelChannel);
      yield fork(pickupStudentsListener, pickupStudentsChannel);
      yield fork(pickupMessagesListener, pickupMessagesChannel);

      yield take(Types.UNLISTEN);
      pickupCancelChannel.close();
      pickupStudentsChannel.close();
      pickupMessagesChannel.close();
    } catch (error) {
      console.log('listenPickup error', error);
    }
  }
}

export function* watchListenPickup() {
  yield fork(listenPickup);
}
