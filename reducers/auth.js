
// @flow

import { types } from '../actions/auth';

const initialState = {
  user: null,
  phoneNumber: null,
  isRequesting: false,
  error: null,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return {...state, phoneNumber: action.phoneNumber, isRequesting: true, error: null};

    case types.REQUEST_LOGIN_SUCCEEDED:
      return {...state, isRequesting: false};

    case types.REQUEST_LOGIN_FAILED:
      return {...state, isRequesting: false, error: 'Login request failed'};

    case types.LOGIN_SUCCEEDED:
      return {...state, user: action.user};

    case types.LOGOUT:
      return {...state, user: null};

    default:
      return state;
  }
}
