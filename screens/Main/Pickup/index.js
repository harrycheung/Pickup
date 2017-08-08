
// @flow

import { StackNavigator } from 'react-navigation';

import SelectScreen from './PickupSelect';
import RequestScreen from './PickupRequest';

export default StackNavigator({
  PickupSelect: { screen: SelectScreen },
  PickupRequest: { screen: RequestScreen },
}, {
  initialRouteName: 'PickupSelect',
});
