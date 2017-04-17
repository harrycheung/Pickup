
import { types } from '../actions/auth';

const initialState = {
  user: null,
  phoneNumber: null,
  isRequesting: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {...state, phoneNumber: action.phoneNumber, isRequesting: true, error: null};

    case types.LOGIN_REQUEST_SUCCEEDED:
      return {...state, isRequesting: false, user: action.user}

    case types.LOGIN_REQUEST_FAILED:
      return {...state, isRequesting: false, error: 'Login request failed'};

    case types.LOGOUT:
      return {...state, user: null};

    default:
      return state;
  }
}
