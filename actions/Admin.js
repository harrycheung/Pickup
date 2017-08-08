
// @flow

export const Types = {
  LOAD_PICKUPS: 'Admin/LOAD_PICKUPS',
  LISTEN_PICKUPS: 'Admin/LISTEN_PICKUPS',
  UNLISTEN_PICKUPS: 'Admin/UNLISTEN_PICKUPS',
  UPDATE_PICKUP: 'Admin/UPDATE_PICKUP',
};

export const Actions = {
  loadPickups: (pickups: Array<Object>) => ({ type: Types.LOAD_PICKUPS, pickups }),
  listenPickups: (grade: string) => ({ type: Types.LISTEN_PICKUPS, grade }),
  unlistenPickups: () => ({ type: Types.UNLISTEN_PICKUPS }),
  updatePickup: (pickupKey: string, studentKey: string, state: Object) => ({
    type: Types.UPDATE_PICKUP, pickupKey, studentKey, state,
  }),
};
