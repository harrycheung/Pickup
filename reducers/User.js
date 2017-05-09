
// @flow

import { Types } from '../actions/User';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  firstName: '',
  lastInitial: '',
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
    case Types.CREATE:
    case Types.UPDATE:
      return {firstName: action.firstName, lastInitial: action.lastInitial};

    case AuthTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
}
