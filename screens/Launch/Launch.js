
import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { NavigationActions } from 'react-navigation';

import constants from '../../config/constants';

class Launch extends React.Component {
  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem(constants.LoginKey);
      if (value !== null) {
        this._navigateTo('Main', { loginKey: value });
      } else {
        this._navigateTo('Login');
      }
    } catch (error) {
      this._navigateTo('Login');
    }
  }

  _navigateTo(routeName, params) {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    })
    this.props.navigation.dispatch(actionToDispatch, params);
  }

  render() {
    return (
      <View />
    );
  }
}

export default Launch;
