
// @flow

import { StackNavigator } from 'react-navigation';

import { colors } from '../../../config/styles';
import { navigationOptions } from '../../../helpers';
import SearchStudentsScreen from './SearchStudents';
import ConfigurePickupScreen from '../Pickup/ConfigurePickup';
import RequestScreen from '../Pickup/PickupRequest';

export default StackNavigator({
  SearchStudents: { screen: SearchStudentsScreen },
  ConfigurePickup: { screen: ConfigurePickupScreen },
  PickupRequest: { screen: RequestScreen },
}, {
  initialRouteName: 'SearchStudents',
  order: ['SearchStudents', 'ConfigurePickup', 'PickupRequest'],
  navigationOptions,
});
