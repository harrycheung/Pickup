
// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import SelectScreen from './Select';
import RequestScreen from './Request';

export default StackNavigator({
  Select: {screen: SelectScreen},
  Request: {screen: RequestScreen},
}, {
  initialRouteName: 'Select',
});
