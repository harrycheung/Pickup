
// @flow

import { Types } from '../actions/Auth';

const initialState = {
  user: null,
};

export default (state: Object = initialState, action: { type: string, user: Object }) => {
  switch (action.type) {
    case Types.SET_USER:
      return { user: action.user };

    case Types.CLEAR:
    case Types.FAILURE:
      return { user: null };

    default:
      return state;
  }
};
