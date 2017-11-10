
// @flow

import { StackNavigator } from 'react-navigation';

import { navigationOptions } from '../../helpers';
import LoginScreen from './Login';
import CreateProfileScreen from './CreateProfile';

export default StackNavigator({
  Login: { screen: LoginScreen },
  CreateProfile: { screen: CreateProfileScreen },
}, {
  initialRouteName: 'Login',
  navigationOptions,
});
