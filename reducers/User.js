
// @flow

import { Types } from '../actions/User';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  uid: '',
  firstName: '',
  lastInitial: '',
  image: '',
  name: '',
  admin: false,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
      return {
        uid: action.uid,
        firstName: action.firstName,
        lastInitial: action.lastInitial,
        image: action.image || '',
        name: `${action.firstName} ${action.lastInitial}`,
        admin: action.admin,
      };

    case Types.CREATE:
    case Types.UPDATE:
      return {
        ...state,
        firstName: action.firstName,
        lastInitial: action.lastInitial,
        image: action.image,
      };

    case AuthTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
