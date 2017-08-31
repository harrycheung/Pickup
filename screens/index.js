
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import LoginRequestScreen from './LoginRequest';
import CreateProfileScreen from './CreateProfile';
import MainScreen from './Main';

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  LoginRequest: { screen: LoginRequestScreen },
  CreateProfile: { screen: CreateProfileScreen },
}, {
  headerMode: 'screen',
  navigationOptions: {
    header: null,
  },
  initialRouteName: 'LoginRequest',
});

const AppWithNavigationState = ({ dispatch, nav }) => {
  return <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;
};

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
