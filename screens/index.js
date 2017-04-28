
// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import LaunchScreen from './Launch';
import LoginScreen from './Login';
import LoginRequestScreen from './LoginRequest';
import MainScreen from './Main';
import AdminScreen from './Admin';

export default StackNavigator({
  Main: {screen: MainScreen},
  Launch: {screen: LaunchScreen},
  Login: {screen: LoginScreen},
  LoginRequest: {screen: LoginRequestScreen},
  Admin: {screen: AdminScreen},
}, {
  headerMode: 'screen',
  navigationOptions: {
    header: {visible: false}
  },
  initialRouteName: 'Launch',
});
