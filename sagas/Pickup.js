
// @flow

import { all, call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { FBref } from '../helpers/firebase';
import { Types, Actions as PickupActions } from '../actions/Pickup';
import { Actions as NavActions } from '../actions/Navigation';
import { Actions as MessageActions } from '../actions/Message';
import { fullName } from '../helpers';

const createPickupAsync = (requestor, students) => {
  const pickupStudents = students.reduce((acc, student) => {
    acc[student.key] = {
      key: student.key,
      name: fullName(student),
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

function* createPickup(action) {
  try {
    const pickup = yield call(createPickupAsync, action.requestor, action.students);
    yield put(PickupActions.createdPickup(pickup));
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('createPickup failed', error);
    // Do nothing?
  }
}

function* watchCreatePickup() {
  yield takeEvery(Types.CREATE, createPickup);
}

const cancelPickupAsync = (pickupKey) => {
  FBref(`/pickups/${pickupKey}`).remove();
};

function* cancelPickup(action) {
  try {
    yield call(cancelPickupAsync, action.pickup.key);
  } catch (error) {
    console.log('cancelPickup failed', error);
    // Do nothing?
  }
}

function* watchCancelPickup() {
  yield takeEvery(Types.CANCEL, cancelPickup);
}

function* resumePickup(action) {
  try {
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('resumePickup failed', error);
  }
}

function* watchResumePickup() {
  yield takeEvery(Types.RESUME, resumePickup);
}

function* handlePickup() {
  try {
    yield put(NavActions.navigate('HandlePickup'));
  } catch (error) {
    console.log('handlePickup error', error);
  }
}

function* watchHandlePickup() {
  yield takeEvery(Types.HANDLE, handlePickup);
}

function* postMessage(action) {
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

function* watchPostMessage() {
  yield takeEvery(Types.POST_MESSAGE, postMessage);
}

const firebaseChannel = (path: string, eventType: string) => (
  eventChannel((emitter) => {
    const ref = FBref(path);

    ref.on(eventType, snapshot => emitter(snapshot));

    return () => ref.off();
  })
);

function* listenPickup() {
  while (true) {
    try {
      const { pickup } = yield take(Types.LISTEN);

      const back = function* (message) {
        yield put(NavActions.back());
        yield put(MessageActions.showMessage(message, 3000));
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

function* watchListenPickup() {
  yield fork(listenPickup);
}

const updatePickupStudent = (pickupKey, studentKey, state) => {
  FBref(`/pickups/${pickupKey}/students/${studentKey}`).update(state);
};

const completePickup = (pickupKey) => {
  FBref(`/pickups/${pickupKey}`).update({ completedAt: Date.now() });
};

function* updateStudent(type, action) {
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

function* watchEscortStudent() {
  yield takeEvery(Types.ESCORT_STUDENT, updateStudent, 'escort');
}

function* watchCancelEscort() {
  yield takeEvery(Types.CANCEL_ESCORT, updateStudent, 'cancel');
}

function* watchReleaseStudent() {
  yield takeEvery(Types.RELEASE_STUDENT, updateStudent, 'release');
}

export default function* pickupSaga() {
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
}
