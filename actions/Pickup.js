
// @flow

export const Types = {
  CREATE: 'Pickup/CREATE',
  CREATED: 'Pickup/CREATED',
  CANCEL: 'Pickup/CANCEL',
  LOAD: 'Pickup/LOAD',
  RESUME: 'Pickup/RESUME',
};

export const Actions = {
  createPickup: (requestor: string, students: Object[]) => ({
    type: Types.CREATE, requestor, students
  }),
  createdPickup: (pickup: Object) => ({type: Types.CREATED, pickup}),
  cancelPickup: (pickup: Object) => ({type: Types.CANCEL, pickup}),
  loadPickup: (pickup: Object) => ({type: Types.LOAD, pickup}),
  resumePickup: (pickup: Object) => ({type: Types.RESUME, pickup}),
}
