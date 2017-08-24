
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Keyboard, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { colors, gstyles } from '../../config/styles';
import { validPhoneNumber } from '../../helpers';
import { Actions as AuthActions } from '../../actions/Auth';
import { Actions as MessageActions } from '../../actions/Message';
import LinedTextInput from '../../components/LinedTextInput';
import MessageView from '../../components/MessageView';
import KeyboardAwareView from '../../components/KeyboardAwareView';

class LoginRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      phoneNumber: '',
      requested: false,
    };

    this._changeText = this._changeText.bind(this);
    this._login = this._login.bind(this);
  }

  state: {
    disabled: boolean,
    phoneNumber: string,
    requested: boolean,
  };

  _changeText(phoneNumber) {
    const disabled = !validPhoneNumber(phoneNumber);
    this.setState({ disabled, phoneNumber });
  }

  _login() {
    Keyboard.dismiss();
    this.props.requestLogin(this.state.phoneNumber);
    this.setState({ requested: true });
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <KeyboardAwareView
          style={[gstyles.flex1, gstyles.flexCenter, gstyles.marginH15]}
          centerOnInput
        >
          <Text style={gstyles.font18}>Enter your phone number</Text>
          <Text style={gstyles.font18}>to get a magic link</Text>
          <LinedTextInput
            style={{ alignSelf: 'stretch' }}
            placeholder="Phone number"
            maxLength={10}
            clearButtonMode="while-editing"
            keyboardType="phone-pad"
            onChangeText={this._changeText}
            onBlur={Keyboard.dismiss}
            keyboardAwareInput
          />
          <Button
            onPress={this._login}
            style={gstyles.marginTop10}
            disabled={this.state.disabled}
            title="Get magic link"
            color={colors.buttonBackground}
          />
        </KeyboardAwareView>
      </MessageView>
    );
  }
}

LoginRequest.propTypes = {
  requestLogin: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(AuthActions, dispatch),
  ...bindActionCreators(MessageActions, dispatch),
});

export default connect(null, mapDispatchToProps)(LoginRequest);
