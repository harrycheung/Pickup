
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import styles from './styles';
import { colors } from '../../config/styles';
import Button from '../../components/Button';
import { Actions as AuthActions } from '../../actions/Auth';
import { Actions as NavActions } from '../../actions/Navigation';
import LinedTextInput from '../../components/LinedTextInput';

class Login extends React.Component {
  state: {
    disabled: boolean,
    phoneNumber: string,
  };

  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      phoneNumber: '',
    };
  }

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
          onChangeText={(text) => this._changeText(text)}
        />
        <Button
          onPress={this._login}
          style={styles.loginButton}
          disabled={this.state.disabled}
        >
          <Text style={styles.loginButtonText}>Get login link</Text>
        </Button>
      </View>
    );
  }

  _changeText = (text) => {
    if (text.length === 10) {
      this.setState({disabled: false, phoneNumber: text});
    } else {
      this.setState({disabled: true});
    }
  }

  _login = () => {
    this.props.requestLogin(this.state.phoneNumber);
  }
}

Login.propTypes = {
  requestLogin: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Login);
