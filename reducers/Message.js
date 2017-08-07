
// @flow

import { Types } from '../actions/Message';

const initialState = {
  message: '',
  duration: 0,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SHOW:
      return { message: action.message, duration: action.duration };

    case Types.CLEAR:
      return initialState;

    default:
      return state;
  }
}
