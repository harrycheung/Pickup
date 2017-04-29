
// @flow

import { Types } from '../actions/Auth';

const initialState = {
  user: null,
  isRequesting: false,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.REQUEST_LOGIN:
      return {...state, isRequesting: true};

    case Types.REQUEST_LOGIN_SUCCEEDED:
      return {...state, isRequesting: false};

    case Types.REQUEST_LOGIN_FAILED:
      return {...state, isRequesting: false};

    case Types.LOGIN:
    case Types.LOGOUT:
      return {...state, isRequesting: true};

    case Types.LOGIN_SUCCEEDED:
      return {...state, user: action.user};

    case Types.LOGIN_FAILED:
    case Types.LOGOUT_FAILED:
      return {...state, isRequesting: false};

    case Types.LOGOUT_SUCCEEDED:
      return {...state, isRequesting: false, user: null};

    default:
      return state;
  }
}
