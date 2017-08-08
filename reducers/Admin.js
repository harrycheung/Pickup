
// @flow

import { Types } from '../actions/Admin';

const initialState = {
  pickups: {},
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.LOAD_PICKUPS:
      return { pickups: action.pickups || {} };

    default:
      return state;
  }
};
