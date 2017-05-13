
// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import GradeSelectScreen from './GradeSelect';
import EscortSelectScreen from './EscortSelect';
import EscortRequestScreen from './EscortRequest';

export default StackNavigator({
  GradeSelect: {screen: GradeSelectScreen},
  EscortSelect: {screen: EscortSelectScreen},
  EscortRequest: {screen: EscortRequestScreen},
}, {
  initialRouteName: 'GradeSelect',
});
