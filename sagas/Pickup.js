
// @flow

import { all, call, fork, put, take, takeEvery } from 'redux-saga/effects';

import { FBref } from '../helpers/firebase';
import { firebaseChannel } from './helpers';
import { Types, Actions as PickupActions } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as MessageActions } from '../actions/Message';

const createPickupAsync = (requestor, students, location, vehicle) => {
  const pickupStudents = students.reduce((acc, student) => {
    acc[student.key] = {
      key: student.key,
      name: student.name,
      image: student.image,
      escort: { uid: '', name: '' },
      released: false,
      grade: student.grade,
    };
    return acc;
  }, {});
  const grades = students.reduce((acc, student) => {
    acc[student.grade] = true;
    return acc;
  }, {});
  const cleanRequestor = { uid: requestor.uid, name: requestor.name, image: requestor.image };
  const pickup = {
    requestor: cleanRequestor,
    students: pickupStudents,
    grades,
    location,
    vehicle,
    createdAt: Date.now(),
  };
  return FBref('/pickups').push(pickup).then(pickupRef => (
    pickupRef.child('messages').push({
      type: 'request',
      sender: cleanRequestor,
      createdAt: Date.now(),
    })
      .then(() => pickupRef)
  ))
    .then((pickupRef) => {
      pickup.key = pickupRef.key;
      pickup.students = pickupStudents;
      return pickup;
    });
};

const createPickup = function* createPickup(action) {
  try {
    yield put(MessageActions.showMessage('Creating pickup', 0));
    const pickup = yield call(
      createPickupAsync,
      action.requestor,
      action.students,
      action.location,
      action.vehicle,
    );
    yield put(PickupActions.createdPickup(pickup));
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('createPickup failed', error);
    // Do nothing?
  } finally {
    yield put(MessageActions.clearMessage());
  }
}

const watchCreatePickup = function* watchCreatePickup() {
  yield takeEvery(Types.CREATE, createPickup);
}

const cancelPickupAsync = (pickupKey) => {
  FBref(`/pickups/${pickupKey}`).remove();
};

const cancelPickup = function* cancelPickup(action) {
  try {
    yield call(cancelPickupAsync, action.pickup.key);
  } catch (error) {
    console.log('cancelPickup failed', error);
    // Do nothing?
  }
}

const watchCancelPickup = function* watchCancelPickup() {
  yield takeEvery(Types.CANCEL, cancelPickup);
}

const resumePickup = function* resumePickup() {
  try {
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('resumePickup failed', error);
  }
}

const watchResumePickup = function* watchResumePickup() {
  yield takeEvery(Types.RESUME, resumePickup);
}

const handlePickup = function* handlePickup() {
  try {
    yield put(NavActions.navigate('HandlePickup'));
  } catch (error) {
    console.log('handlePickup error', error);
  }
}

const watchHandlePickup = function* watchHandlePickup() {
  yield takeEvery(Types.HANDLE, handlePickup);
}

const postMessage = function* postMessage(action) {
  try {
    const { sender } = action;
    const messageData = {
      sender: { uid: sender.uid, name: sender.name, image: sender.image },
      createdAt: Date.now(),
      ...action.message,
    };

    FBref(`/pickups/${action.pickup.key}/messages`).push(messageData);
  } catch (error) {
    console.log('postMessage failed', error);
  }
}

const watchPostMessage = function* watchPostMessage() {
  yield takeEvery(Types.POST_MESSAGE, postMessage);
}

const listenPickup = function* listenPickup() {
  while (true) {
    try {
      const { pickup } = yield take(Types.LISTEN);

      const back = function* (message) {
        yield put(NavActions.back());
        yield put(MessageActions.showMessage(message, 1500));
        yield put(PickupActions.clearPickup());
      };

      const pickupCancelChannel = firebaseChannel(`/pickups/${pickup.key}`, 'value');
      const pickupCancelListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          if (snapshot.val() === null) {
            yield call(back, 'Pickup canceled');
          }
        }
      };

      const pickupCompleteChannel = firebaseChannel(`/pickups/${pickup.key}/completedAt`, 'value');
      const pickupCompleteListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          if (snapshot.val()) {
            yield call(back, 'Pickup completed');
          }
        }
      };

      const pickupStudentsChannel = firebaseChannel(`/pickups/${pickup.key}/students`, 'value');
      const pickupStudentsListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          const students = snapshot.val();
          if (students) {
            yield put(PickupActions.updateStudents(students));
          }
        }
      };

      const pickupMessagesChannel = firebaseChannel(`/pickups/${pickup.key}/messages`, 'value');
      const pickupMessagesListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          const messages = snapshot.val();
          if (messages) {
            yield put(PickupActions.updateMessages(messages));
          }
        }
      };

      yield fork(pickupCancelListener, pickupCancelChannel);
      yield fork(pickupCompleteListener, pickupCompleteChannel);
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

const watchListenPickup = function* watchListenPickup() {
  yield fork(listenPickup);
}

const updatePickupStudent = (pickupKey, studentKey, state) => {
  FBref(`/pickups/${pickupKey}/students/${studentKey}`).update(state);
};

const completePickup = (pickupKey) => {
  FBref(`/pickups/${pickupKey}`).update({ completedAt: Date.now() });
};

const updateStudent = function* updateStudent(type, action) {
  try {
    const { pickup, user, student } = action;

    switch (type) {
      case 'escort': {
        yield call(updatePickupStudent, pickup.key, student.key, {
          escort: { uid: user.uid, name: user.name, image: user.image },
        });
        break;
      }
      case 'cancel': {
        yield call(updatePickupStudent, pickup.key, student.key, {
          escort: { uid: '', name: '', image: '' },
        });
        break;
      }
      case 'release': {
        yield call(updatePickupStudent, pickup.key, student.key, { released: true });
        let completed = true;
        Object.keys(pickup.students).forEach((key) => {
          const otherStudent = pickup.students[key];
          if (student.key !== otherStudent.key && !otherStudent.released) {
            completed = false;
          }
        });
        if (completed) {
          yield call(completePickup, pickup.key);
        }
        break;
      }

      default:
    }

    yield call(
      postMessage, {
        pickup,
        sender: {
          uid: user.uid,
          name: user.name,
          image: user.image,
        },
        message: {
          type,
          student: {
            key: student.key,
            name: student.name,
            image: student.image,
          },
        },
      },
    );
  } catch (error) {
    console.log('escortStudent error', error);
  }
}

const watchEscortStudent = function* watchEscortStudent() {
  yield takeEvery(Types.ESCORT_STUDENT, updateStudent, 'escort');
}

const watchCancelEscort = function* watchCancelEscort() {
  yield takeEvery(Types.CANCEL_ESCORT, updateStudent, 'cancel');
}

const watchReleaseStudent = function* watchReleaseStudent() {
  yield takeEvery(Types.RELEASE_STUDENT, updateStudent, 'release');
}

const pickupSaga = function* pickupSaga() {
  yield all([
    watchCreatePickup(),
    watchCancelPickup(),
    watchResumePickup(),
    watchPostMessage(),
    watchHandlePickup(),
    watchListenPickup(),
    watchEscortStudent(),
    watchCancelEscort(),
    watchReleaseStudent(),
  ]);
};

export default pickupSaga;
