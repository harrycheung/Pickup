
// @flow

import { StackNavigator } from 'react-navigation';

import { colors } from '../../../config/styles';
import AllStudentsScreen from './AllStudents';
import ConfigurePickupScreen from '../Pickup/ConfigurePickup';
import RequestScreen from '../Pickup/PickupRequest';

export default StackNavigator({
  AllStudents: { screen: AllStudentsScreen },
  ConfigurePickup: { screen: ConfigurePickupScreen },
  PickupRequest: { screen: RequestScreen },
}, {
  initialRouteName: 'AllStudents',
  order: ['AllStudents', 'ConfigurePickup', 'PickupRequest'],
  navigationOptions: {
    headerStyle: { backgroundColor: colors.buttonBackground },
    headerTintColor: 'white',
  },
});
