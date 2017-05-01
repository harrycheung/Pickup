
// @flow

export const Types = {
  PICKUP: 'Pickup/PICKUP',
  PICKUP_REQUESTED: 'Pickup/PICKUP_REQUESTED',
  PICKUP_CANCELED: 'Pickup/PICKUP_CANCELED',
  PICKUP_COMPLETED: 'Pickup/PICKUP_COMPLETED',
};

export const Actions = {
  pickup: (students: Object[]) => ({type: Types.PICKUP, students}),
  pickupRequested: (request: Object) => ({type: Types.PICKUP_REQUESTED, request}),
  pickupCanceled: () => ({type: Types.PICKUP_CANCELED}),
  pickupCompleted: () => ({type: Types.PICKUP_COMPLETED}),
}
