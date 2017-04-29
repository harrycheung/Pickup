
// @flow

import { AppNavigator } from '../screens';

export default (state: Object, action: Object) => (
  AppNavigator.router.getStateForAction(action, state)
)
