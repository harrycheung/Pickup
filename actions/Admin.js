
// @flow

export const Types = {
  LOAD_PICKUPS: 'Admin/LOAD_PICKUPS',
  LISTEN_PICKUPS: 'Admin/LISTEN_PICKUPS',
  UNLISTEN_PICKUPS: 'Admin/UNLISTEN_PICKUPS',
};

export const Actions = {
  loadPickups: (pickups: Array<Object>) => ({ type: Types.LOAD_PICKUPS, pickups }),
  listenPickups: (grade: string, location: string) => ({ type: Types.LISTEN_PICKUPS, grade, location }),
  unlistenPickups: () => ({ type: Types.UNLISTEN_PICKUPS }),
};
