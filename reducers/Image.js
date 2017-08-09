
// @flow

import { Types } from '../actions/Image';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  url: '',
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
      return { url: action.imageURL };

    case Types.CLEAR:
    case AuthTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
