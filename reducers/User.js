
// @flow

import { Types } from '../actions/User';

const initialState = {
  firstName: '',
  lastInitial: '',
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
    case Types.UPDATE:
      return {
        ...state, firstName: action.firstName, lastInitial: action.lastInitial
      };

    default:
      return state;
  }
}
