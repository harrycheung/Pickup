
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Keyboard, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { colors, gstyles } from '../../config/styles';
import { validPhoneNumber } from '../../helpers';
import Button from '../../components/Button';
import { Actions as AuthActions } from '../../actions/Auth';
import LinedTextInput from '../../components/LinedTextInput';
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

  componentWillReceiveProps(nextProps: Object) {
    this.setState({ disabled: nextProps.spinning });
  }

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
    let buttonContent = null;
    if (this.props.spinning) {
      buttonContent = (
        <ActivityIndicator animating color="white" size="small" />
      );
    } else if (this.props.requested) {
      buttonContent = 'Get magic link again';
    } else {
      buttonContent = 'Get magic link';
    }

    return (
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
          borderBottomColor={colors.darkGrey}
          keyboardType="phone-pad"
          selectionColor="black"
          onChangeText={this._changeText}
          onBlur={Keyboard.dismiss}
          keyboardAwareInput
        />
        <Button
          onPress={this._login}
          style={gstyles.marginTop10}
          disabled={this.state.disabled}
          content={buttonContent}
        />
      </KeyboardAwareView>
    );
  }
}

LoginRequest.propTypes = {
  requested: PropTypes.bool,
  spinning: PropTypes.bool.isRequired,
  requestLogin: PropTypes.func.isRequired,
};

LoginRequest.defaultProps = {
  requested: false,
};

const mapStateToProps = state => ({
  spinning: state.spinner,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(AuthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRequest);
