
// @flow

import { Types } from '../actions/Pickup';

const initialState = {
  pickup: null,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.CREATED:
    case Types.LOAD:
      return {pickup: action.pickup};

    case Types.CANCEL:
      return {pickup: null};    

    default:
      return state;
  }
}
