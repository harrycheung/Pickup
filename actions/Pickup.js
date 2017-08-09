
// @flow

export const Types = {
  CREATE: 'Pickup/CREATE',
  CREATED: 'Pickup/CREATED',
  CANCEL: 'Pickup/CANCEL',
  CLEAR: 'Pickup/CLEAR',
  RESUME: 'Pickup/RESUME',
  LOAD: 'Pickup/LOAD',
  POST_MESSAGE: 'Pickup/POST_MESSAGE',
  HANDLE: 'Pickup/HANDLE',
  LISTEN: 'Pickup/LISTEN',
  UNLISTEN: 'Pickup/UNLISTEN',
  UPDATE_MESSAGES: 'Pickup/UPDATE_MESSAGES',
  UPDATE_STUDENTS: 'Pickup/UPDATE_STUDENTS',
  ESCORT_STUDENT: 'Pickup/ESCORT_STUDENT',
  CANCEL_ESCORT: 'Pickup/CANCEL_ESCORT',
  RELEASE_STUDENT: 'Pickup/RELEASE_STUDENT',
};

export const Actions = {
  createPickup: (requestor: Object, students: Object[]) => ({
    type: Types.CREATE, requestor, students,
  }),
  createdPickup: (pickup: Object) => ({ type: Types.CREATED, pickup }),
  cancelPickup: (pickup: Object) => ({ type: Types.CANCEL, pickup }),
  clearPickup: () => ({ type: Types.CLEAR }),
  resumePickup: (pickup: Object) => ({ type: Types.RESUME, pickup }),
  loadPickup: (pickup: Object) => ({ type: Types.LOAD, pickup }),
  escortStudent: (pickup: Object, user: Object, student: Object) => ({
    type: Types.ESCORT_STUDENT, pickup, user, student,
  }),
  cancelEscort: (pickup: Object, user: Object, student: Object) => ({
    type: Types.CANCEL_ESCORT, pickup, user, student,
  }),
  releaseStudent: (pickup: Object, user: Object, student: Object) => ({
    type: Types.RELEASE_STUDENT, pickup, user, student,
  }),
  postMessage: (pickup: Object, sender: Object, message: string) => ({
    type: Types.POST_MESSAGE, pickup, sender, message,
  }),
  handlePickup: (pickup: Object) => ({ type: Types.HANDLE, pickup }),
  listenPickup: (pickup: Object) => ({ type: Types.LISTEN, pickup }),
  unlistenPickup: () => ({ type: Types.UNLISTEN }),
  updateMessages: (messages: Array<Object>) => ({
    type: Types.UPDATE_MESSAGES, messages,
  }),
  updateStudents: (students: Array<Object>) => ({
    type: Types.UPDATE_STUDENTS, students,
  }),
};
