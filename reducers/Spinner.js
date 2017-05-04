
// @flow

import { Types } from '../actions/Spinner';

export default (state: Object, action: Object) => {
  switch (action.type) {
    case Types.START:
      return {spinning: true};

    case Types.STOP:
    default:
      return {spinning: false};
  }
}
