
// @flow

import { Types } from '../actions/Pickup';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  active: false,
  request: null,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.PICKUP_REQUESTED:
      return {active: true, request: action.request};

    case Types.PICKUP_COMPLETED:
    case Types.PICKUP_CANCELED:
    case AuthTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
}
