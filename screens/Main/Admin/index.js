
// @flow

import { StackNavigator } from 'react-navigation';

import { navigationOptions } from '../../../helpers';
import PickupSelectScreen from './PickupSelect';
import HandlePickupScreen from './HandlePickup';

export default StackNavigator({
  PickupSelect: { screen: PickupSelectScreen },
  HandlePickup: { screen: HandlePickupScreen },
}, {
  initialRouteName: 'PickupSelect',
  navigationOptions,
});
