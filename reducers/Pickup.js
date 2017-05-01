
// @flow

import { Types } from '../actions/Pickup';

const initialState = {
  active: false,
  request: null,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.PICKUP_REQUESTED:
      return {...state, active: true, request: action.request};

    case Types.PICKUP_COMPLETED:
    case Types.PICKUP_CANCELED:
      return {...state, active: false, request: null};

    default:
      return state;
  }
}
