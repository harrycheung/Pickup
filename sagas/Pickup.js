
// @flow

import { channel } from 'redux-saga';
import { all, call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { Location, Permissions } from 'expo';

import * as C from '../config/constants';
import { FBref } from '../helpers/firebase';
import { todayStr } from '../helpers';
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
      releaser: { uid: '', name: '' },
      grade: student.grade,
    };
    return acc;
  }, {});
  let lowerSchool = false;
  let middleSchool = false;
  const grades = students.reduce((acc, student) => {
    lowerSchool = lowerSchool || C.LowerSchool.includes(student.grade);
    middleSchool = middleSchool || C.MiddleSchool.includes(student.grade);
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
    coordinates: { latitude: 37.78825, longitude: -122.4324 },
    lowerSchool,
    middleSchool,
  };
  return FBref(`/pickups/${todayStr()}`).push(pickup).then(pickupRef => (
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
    yield put(NavActions.navigate('PickupRequest', { key: action.navKey }));
  } catch (error) {
    console.log('createPickup failed', error);
    // Do nothing?
  } finally {
    yield put(MessageActions.clearMessage());
  }
};

const watchCreatePickup = function* watchCreatePickup() {
  yield takeEvery(Types.CREATE, createPickup);
};

const cancelPickupAsync = (pickupKey) => {
  FBref(`/pickups/${todayStr()}/${pickupKey}`).remove();
};

const cancelPickup = function* cancelPickup(action) {
  try {
    yield call(cancelPickupAsync, action.pickup.key);
  } catch (error) {
    console.log('cancelPickup failed', error);
    // Do nothing?
  }
};

const watchCancelPickup = function* watchCancelPickup() {
  yield takeEvery(Types.CANCEL, cancelPickup);
};

const resumePickup = function* resumePickup() {
  try {
    yield put(NavActions.navigate('PickupRequest'));
  } catch (error) {
    console.log('resumePickup failed', error);
  }
};

const watchResumePickup = function* watchResumePickup() {
  yield takeEvery(Types.RESUME, resumePickup);
};

const handlePickup = function* handlePickup(action) {
  try {
    yield put(PickupActions.listenPickup(action.pickup));
    yield put(PickupActions.listenCoordinates(action.pickup));
    yield put(NavActions.navigate('HandlePickup'));
  } catch (error) {
    console.log('handlePickup error', error);
  }
};

const watchHandlePickup = function* watchHandlePickup() {
  yield takeEvery(Types.HANDLE, handlePickup);
};

const postMessage = function* postMessage(action) {
  try {
    const { sender } = action;
    const messageData = {
      sender: { uid: sender.uid, name: sender.name, image: sender.image },
      createdAt: Date.now(),
      ...action.message,
    };

    FBref(`/pickups/${todayStr()}/${action.pickup.key}/messages`).push(messageData);
  } catch (error) {
    console.log('postMessage failed', error);
  }
};

const watchPostMessage = function* watchPostMessage() {
  yield takeEvery(Types.POST_MESSAGE, postMessage);
};

const listenPickup = function* listenPickup() {
  while (true) {
    try {
      const { pickup } = yield take(Types.LISTEN);

      const back = function* (message) {
        const state = yield select();
        if (pickup.requestor.uid === state.user.uid) {
          yield put(NavActions.resetNavigation('Main'));
        } else {
          yield put(NavActions.back());
        }
        yield put(MessageActions.showMessage(message, 1500));
        yield put(PickupActions.clearPickup());
      };

      const pickupCancelChannel = firebaseChannel(`/pickups/${todayStr()}/${pickup.key}`, 'value');
      const pickupCancelListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          if (snapshot.val() === null) {
            yield call(back, 'Pickup canceled');
          }
        }
      };

      const pickupCompleteChannel = firebaseChannel(`/pickups/${todayStr()}/${pickup.key}/completedAt`, 'value');
      const pickupCompleteListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          if (snapshot.val()) {
            // Aggressively stop listening to the pickup to stop any other db updates
            yield put(PickupActions.unlistenPickup());
            yield put(PickupActions.unlistenCoordinates());
            yield put(PickupActions.clearPickup());
            yield call(back, 'Pickup completed');
          }
        }
      };

      const pickupStudentsChannel = firebaseChannel(`/pickups/${todayStr()}/${pickup.key}/students`, 'value');
      const pickupStudentsListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          const students = snapshot.val();
          if (students) {
            yield put(PickupActions.updateStudents(students));
          }
        }
      };

      const pickupMessagesChannel = firebaseChannel(`/pickups/${todayStr()}/${pickup.key}/messages`, 'value');
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
      pickupCompleteChannel.close();
      pickupStudentsChannel.close();
      pickupMessagesChannel.close();
    } catch (error) {
      console.log('listenPickup error', error);
    }
  }
};

const watchListenPickup = function* watchListenPickup() {
  yield fork(listenPickup);
};

const updatePickupStudent = (pickupKey, studentKey, state, completed) => {
  const update = {};
  Object.keys(state).forEach((key) => {
    update[`/pickups/${todayStr()}/${pickupKey}/students/${studentKey}/${key}`] = state[key];
  });
  if (completed) {
    update[`/pickups/${todayStr()}/${pickupKey}/completedAt`] = Date.now();
  } else {
    update[`/pickups/${todayStr()}/${pickupKey}/completedAt`] = null;
  }
  FBref('/').update(update);
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
        let completed = true;
        Object.keys(pickup.students).forEach((key) => {
          const otherStudent = pickup.students[key];
          if (student.key !== otherStudent.key && otherStudent.releaser.uid === '') {
            completed = false;
          }
        });
        yield call(updatePickupStudent, pickup.key, student.key, {
          releaser: { uid: user.uid, name: user.name, image: user.image },
        }, completed);
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
};

const watchEscortStudent = function* watchEscortStudent() {
  yield takeEvery(Types.ESCORT_STUDENT, updateStudent, 'escort');
};

const watchCancelEscort = function* watchCancelEscort() {
  yield takeEvery(Types.CANCEL_ESCORT, updateStudent, 'cancel');
};

const watchReleaseStudent = function* watchReleaseStudent() {
  yield takeEvery(Types.RELEASE_STUDENT, updateStudent, 'release');
};

const undoRelease = function* undoRelease(action) {
  const { pickup, student } = action;
  yield call(updatePickupStudent, pickup.key, student.key, {
    releaser: { uid: '', name: '', image: '' },
  }, false);
};

const watchUndoRelease = function* watchUndoRelease() {
  yield takeEvery(Types.UNDO_RELEASE, undoRelease);
};

const updateLocation = function* updateLocation(action) {
  try {
    const { latitude, longitude } = action.coordinates;
    FBref(`/pickups/${todayStr()}/${action.pickup.key}/coordinates`).set({
      latitude, longitude,
    });
  } catch (error) {
    console.log('updateLocation failed', error);
  }
};

const watchUpdateLocation = function* watchUpdateLocation() {
  yield takeEvery(Types.UPDATE_LOCATION, updateLocation);
};

const watchLocation = (pickup, channel) => (
  Permissions.askAsync(Permissions.LOCATION)
    .then(({ status }) => {
      if (status === 'granted') {
        return Location.watchPositionAsync({
          enableHighAccuracy: true,
          timeInterval: 1000,
        }, ({ coords }) => {
          channel.put(PickupActions.updateLocation(pickup, coords));
        });
      }
      return null;
    })
);

const listenLocation = function* listenLocation() {
  while (true) {
    try {
      const { pickup } = yield take(Types.LISTEN_LOCATION);

      const locationChannel = channel();
      const locationListener = function* (channel) {
        while (true) {
          yield put(yield take(channel));
        }
      };

      const locationWatcher = yield call(watchLocation, pickup, locationChannel);
      if (locationWatcher !== null) {
        yield fork(locationListener, locationChannel);

        yield take(Types.UNLISTEN_LOCATION);
        locationChannel.close();
        locationWatcher.remove();
      }
    } catch (error) {
      console.log('listenLocation failed', error);
    }
  }
};

const watchListenLocation = function* watchListenLocation() {
  yield fork(listenLocation);
};

const listenCoordinates = function* listenCoordinates() {
  while (true) {
    try {
      const { pickup } = yield take(Types.LISTEN_COORDINATES);

      const coordinatesChannel = firebaseChannel(`/pickups/${todayStr()}/${pickup.key}/coordinates`, 'value');
      const coordinatesListener = function* (channel) {
        while (true) {
          const snapshot = yield take(channel);
          if (snapshot.val()) {
            yield put(PickupActions.updateCoordinates(pickup, snapshot.val()));
          }
        }
      };

      yield fork(coordinatesListener, coordinatesChannel);

      yield take(Types.UNLISTEN_COORDINATES);
      coordinatesChannel.close();
    } catch (error) {
      console.log('listenLocation failed', error);
    }
  }
};

const watchListenCoordinates = function* watchListenCoordinates() {
  yield fork(listenCoordinates);
};

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
    watchUndoRelease(),
    watchUpdateLocation(),
    watchListenLocation(),
    watchListenCoordinates(),
  ]);
};

export default pickupSaga;
