
// @flow

import { Types } from '../actions/Pickup';

const initialState = {
  pickup: null,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.CREATED:
    case Types.LOAD:
    case Types.HANDLE:
      return { pickup: action.pickup };

    case Types.CANCEL:
    case Types.CLEAR:
      return initialState;

    case Types.UPDATE_MESSAGES:
      if (state.pickup) {
        return { pickup: { ...state.pickup, messages: action.messages } };
      }
      return state;

    case Types.UPDATE_STUDENTS:
      if (state.pickup) {
        return { pickup: { ...state.pickup, students: action.students } };
      }
      return state;

    case Types.UPDATE_LOCATION:
    case Types.UPDATE_COORDINATES:
      if (state.pickup) {
        return { pickup: { ...state.pickup, coordinates: action.coordinates } };
      }
      return state;

    default:
      return state;
  }
};
