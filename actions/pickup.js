
// @flow

export const types = {
  PICKUP_REQUEST: 'Pickup/PICKUP_REQUEST',
};

export const actions = {
  pickupRequest: (students: Object[]) => ({
    type: types.PICKUP_REQUEST, students
  }),
}
