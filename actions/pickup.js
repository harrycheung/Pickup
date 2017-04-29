
// @flow

export const Types = {
  PICKUP_REQUEST: 'Pickup/PICKUP_REQUEST',
};

export const Actions = {
  pickupRequest: (students: Object[]) => ({
    type: Types.PICKUP_REQUEST, students
  }),
}
