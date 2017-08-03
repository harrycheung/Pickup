
// @flow

export const Types = {
  CREATE: 'Pickup/CREATE',
  CREATED: 'Pickup/CREATED',
  CANCEL: 'Pickup/CANCEL',
  RESUME: 'Pickup/RESUME',
  LOAD: 'Pickup/LOAD',
  POST_MESSAGE: 'Pickup/POST_MESSAGE',
};

export const Actions = {
  createPickup: (requestor: Object, students: Object[]) => ({
    type: Types.CREATE, requestor, students
  }),
  createdPickup: (pickup: Object) => ({type: Types.CREATED, pickup}),
  cancelPickup: (pickup: Object) => ({type: Types.CANCEL, pickup}),
  resumePickup: (pickup: Object) => ({type: Types.RESUME, pickup}),
  loadPickup: (pickup: Object) => ({type: Types.LOAD, pickup}),
  postMessage: (pickup: Object, sender: string, message: string) => ({
    type: Types.POST_MESSAGE, pickup, sender, message
  }),
}
