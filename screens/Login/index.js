
// @flow

import { StackNavigator } from 'react-navigation';

import { colors } from '../../config/styles';
import LoginScreen from './Login';
import CreateProfileScreen from './CreateProfile';

export default StackNavigator({
  Login: { screen: LoginScreen },
  CreateProfile: { screen: CreateProfileScreen },
}, {
  initialRouteName: 'Login',
  navigationOptions: {
    headerStyle: { backgroundColor: colors.buttonBackground },
    headerTintColor: 'white',
  },
});
