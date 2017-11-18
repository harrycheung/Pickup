
// @flow

export const Types = {
  LOAD_PICKUPS: 'Admin/LOAD_PICKUPS',
  LISTEN_PICKUPS: 'Admin/LISTEN_PICKUPS',
  UNLISTEN_PICKUPS: 'Admin/UNLISTEN_PICKUPS',
  SEARCH_STUDENTS: 'Student/SEARCH_STUDENTS',
  SET_STUDENTS: 'Admin/SET_STUDENTS',
  RELEASE_PICKUPS: 'Admin/RELEASE_PICKUPS',
};

export const Actions = {
  loadPickups: (pickups: Array<Object>) => ({ type: Types.LOAD_PICKUPS, pickups }),
  listenPickups: (filter: string) => ({ type: Types.LISTEN_PICKUPS, filter }),
  unlistenPickups: () => ({ type: Types.UNLISTEN_PICKUPS }),
  searchStudents: (name: string) => ({ type: Types.SEARCH_STUDENTS, name }),
  setStudents: (students: Array<Object>) => ({ type: Types.SET_STUDENTS, students }),
  releasePickups: (pickups: Array<string>) => ({ type: Types.RELEASE_PICKUPS, pickups }),
};
