
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import styles from './styles';
import { colors } from '../../config/styles';
import Button from '../../components/Button';
import { Actions as AuthActions } from '../../actions/Auth';
import LinedTextInput from '../../components/LinedTextInput';

class LoginRequest extends React.Component {
  state: {
    disabled: boolean,
    phoneNumber: string,
    requested: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      phoneNumber: '',
      requested: false,
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    this.setState({disabled: nextProps.spinning});
  }

  render() {
    let buttonContent = null;
    if (this.props.spinning) {
      buttonContent = (
        <ActivityIndicator animating={true} color='white' size='small' />
      );
    } else if (this.props.requested) {
      buttonContent = (
        <Text style={styles.loginButtonText}>Get magic link again</Text>
      )
    } else {
      buttonContent = (
        <Text style={styles.loginButtonText}>Get magic link</Text>
      );
    }

    return (
      <View style={styles.container}>
        <Text>Enter your phone number to request a magic link</Text>
        <LinedTextInput
          style={styles.input}
          placeholder='Phone number'
          maxLength={10}
          clearButtonMode='while-editing'
          borderBottomColor={colors.darkGrey}
          keyboardType='phone-pad'
          onChangeText={this._changeText.bind(this)}
        />
        <Button
          onPress={this._login.bind(this)}
          style={styles.loginButton}
          disabled={this.state.disabled}
        >
          {buttonContent}
        </Button>
      </View>
    );
  }

  _changeText(phoneNumber) {
    const disabled = phoneNumber.length !== 10 || isNaN(phoneNumber);
    this.setState({disabled, phoneNumber});
  }

  _login() {
    this.props.requestLogin(this.state.phoneNumber);
    this.setState({requested: true});
  }
}

LoginRequest.propTypes = {
  spinning: PropTypes.bool.isRequired,
  requestLogin: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  spinning: state.spinner.spinning,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRequest);
