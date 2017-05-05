
// @flow

import { Types } from '../actions/Auth';

const initialState = {
  user: null,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.LOGIN_SUCCEEDED:
      return {...state, user: action.user};

    case Types.LOGOUT_SUCCEEDED:
      return {...state, user: null};

    default:
      return state;
  }
}
