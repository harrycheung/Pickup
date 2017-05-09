
// @flow

import { Types } from '../actions/Spinner';

const initialState = {
  spinning: false,
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.START:
      return {spinning: true};

    case Types.STOP:
      return initialState

    default:
      return state;
  }
}
