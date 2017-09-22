
// @flow

import { StackNavigator } from 'react-navigation';

import { colors } from '../../../config/styles';
import SelectScreen from './StudentSelect';
import ConfigurePickupScreen from './ConfigurePickup';
import RequestScreen from './PickupRequest';

export default StackNavigator({
  StudentSelect: { screen: SelectScreen },
  ConfigurePickup: { screen: ConfigurePickupScreen },
  PickupRequest: { screen: RequestScreen },
}, {
  initialRouteName: 'StudentSelect',
  order: ['StudentSelect', 'ConfigurePickup', 'PickupRequest'],
  navigationOptions: {
    headerStyle: { backgroundColor: colors.buttonBackground },
    headerTintColor: 'white',
  },
});
