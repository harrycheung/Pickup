
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
    case Types.CANCELED:
      return initialState;

    case Types.UPDATE_MESSAGES:
      return { pickup: { ...state.pickup, messages: action.messages } };

    case Types.UPDATE_STUDENTS:
      return { pickup: { ...state.pickup, students: action.students } };

    default:
      return state;
  }
}
