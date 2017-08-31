
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import LoginScreen from './Login';
import MainScreen from './Main';

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  Login: { screen: LoginScreen },
}, {
  initialRouteName: 'Login',
  headerMode: 'none',
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
