
// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import LoginTokenScreen from './LoginToken';
import CreateProfileScreen from './CreateProfile';

export default StackNavigator({
  LoginToken: {screen: LoginTokenScreen},
  CreateProfile: {screen: CreateProfileScreen},
}, {
  initialRouteName: 'LoginToken',
});
