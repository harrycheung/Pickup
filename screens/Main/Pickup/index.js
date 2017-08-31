
// @flow

import { StackNavigator } from 'react-navigation';

import { colors } from '../../../config/styles';
import SelectScreen from './StudentSelect';
import RequestScreen from './PickupRequest';

export default StackNavigator({
  StudentSelect: { screen: SelectScreen },
  PickupRequest: { screen: RequestScreen },
}, {
  initialRouteName: 'StudentSelect',
  navigationOptions: {
    headerStyle: { backgroundColor: colors.buttonBackground },
    headerTintColor: 'white',
  },
});
