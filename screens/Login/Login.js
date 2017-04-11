
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { colors } from '../../config/styles';
import LinedTextInput from '../../components/LinedTextInput';

class Login extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Enter your phone number to login.</Text>
        <LinedTextInput
          style={[styles.input]}
          placeholder='Phone number'
          maxLength={10}
          clearButtonMode='while-editing'
          borderBottomColor={colors.darkGrey}
          keyboardType='phone-pad'
        />
        <TouchableOpacity
          onPress={this._login}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Get login link</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _navigateTo(routeName, params) {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    })
    this.props.navigation.dispatch(actionToDispatch, params);
  }

  _login() {
    this._navigateTo('Main', { loginKey: 'harry' });
  }
}

export default Login;
