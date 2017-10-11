
// @flow

import { Types } from '../actions/Admin';

const initialState = {
  pickups: {},
  students: [],
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.LOAD_PICKUPS:
      return {
        ...state,
        pickups: action.pickups || {},
      };

    case Types.SET_STUDENTS:
      return {
        ...state,
        students: action.students || {},
      };

    default:
      return state;
  }
};
