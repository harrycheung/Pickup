
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import LaunchScreen from './Launch';
import LoginScreen from './Login';
import LoginRequestScreen from './LoginRequest';
import MainScreen from './Main';
import AdminScreen from './Admin';

export const AppNavigator = StackNavigator({
  Main: {screen: MainScreen},
  Launch: {screen: LaunchScreen},
  Login: {screen: LoginScreen},
  LoginRequest: {screen: LoginRequestScreen},
  Admin: {screen: AdminScreen},
}, {
  headerMode: 'screen',
  navigationOptions: {
    header: null,
  },
  initialRouteName: 'Launch',
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
