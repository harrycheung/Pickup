
// @flow

import { Types } from '../actions/User';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  firstName: '',
  lastInitial: '',
  admin: false,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
      return {
        firstName: action.firstName,
        lastInitial: action.lastInitial,
        admin: action.admin,
      };

    case Types.CREATE:
    case Types.UPDATE:
      return {
        ...state,
        firstName: action.firstName,
        lastInitial: action.lastInitial,
      };

    case AuthTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
}
