
import { types } from '../actions/auth';

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };

    case types.LOGOUT:
      return { ...state, user: null };

    default:
      return state;
  }
}
