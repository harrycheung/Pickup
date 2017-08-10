
// @flow

import { StackNavigator } from 'react-navigation';

import SelectScreen from './StudentSelect';
import RequestScreen from './PickupRequest';

export default StackNavigator({
  StudentSelect: { screen: SelectScreen },
  PickupRequest: { screen: RequestScreen },
}, {
  initialRouteName: 'StudentSelect',
});
