
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { colors, gstyles } from '../../config/styles';
import { validPhoneNumber } from '../../helpers';
import Button from '../../components/Button';
import { Actions as AuthActions } from '../../actions/Auth';
import LinedTextInput from '../../components/LinedTextInput';

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
      <View style={[gstyles.flex1, gstyles.flexCenter, gstyles.marginH15]}>
        <Text>Enter your phone number to request a magic link</Text>
        <LinedTextInput
          style={gstyles.textInput}
          placeholder="Phone number"
          maxLength={10}
          clearButtonMode="while-editing"
          borderBottomColor={colors.darkGrey}
          keyboardType="phone-pad"
          onChangeText={this._changeText}
        />
        <Button
          onPress={this._login}
          style={gstyles.marginTop10}
          disabled={this.state.disabled}
          content={buttonContent}
        />
      </View>
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
