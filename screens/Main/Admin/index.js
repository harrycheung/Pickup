
// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import GradeSelectScreen from './GradeSelect';
import EscortSelectScreen from './EscortSelect';

export default StackNavigator({
  GradeSelect: {screen: GradeSelectScreen},
  EscortSelect: {screen: EscortSelectScreen},
}, {
  initialRouteName: 'GradeSelect',
});
