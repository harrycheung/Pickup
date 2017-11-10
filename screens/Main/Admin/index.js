
// @flow

import { StackNavigator } from 'react-navigation';

import { navigationOptions } from '../../../helpers';
import GradeSelectScreen from './GradeSelect';
import PickupSelectScreen from './PickupSelect';
import HandlePickupScreen from './HandlePickup';

export default StackNavigator({
  GradeSelect: { screen: GradeSelectScreen },
  PickupSelect: { screen: PickupSelectScreen },
  HandlePickup: { screen: HandlePickupScreen },
}, {
  initialRouteName: 'GradeSelect',
  navigationOptions,
});
