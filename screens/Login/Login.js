
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Keyboard, Linking, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { colors, gstyles } from '../../config/styles';
import { validPhoneNumber } from '../../helpers';
import { Actions as AuthActions } from '../../actions/Auth';
import LinedTextInput from '../../components/LinedTextInput';
import MessageView from '../../components/MessageView';
import KeyboardAwareView from '../../components/KeyboardAwareView';

class Login extends React.Component {
  static navigationOptions = () => ({
    title: 'Synapse Pickup',
    headerStyle: { backgroundColor: colors.buttonBackground },
    headerTintColor: 'white',
  });

  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      phoneNumber: '',
      requested: false,
    };

    this._changeText = this._changeText.bind(this);
    this._getLink = this._getLink.bind(this);
    this._login = this._login.bind(this);
  }

  state: {
    disabled: boolean,
    phoneNumber: string,
    requested: boolean,
  };

  componentDidMount() {
    Linking.addEventListener('url', this._login);
    Linking.getInitialURL().then((url) => {
      if (url) {
        this._login({ url });
      }
    }).catch(err => console.error('An error occurred', err));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._login);
  }

  _login({ url }) {
    this.props.login(url.split('+').pop());
  }

  _changeText(phoneNumber) {
    const disabled = !validPhoneNumber(phoneNumber);
    this.setState({ disabled, phoneNumber });
  }

  _getLink() {
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
          <View style={gstyles.flexRow}>
            <View style={gstyles.flex1} />
            <LinedTextInput
              style={{ width: '75%', alignItems: 'center', alignSelf: 'center' }}
              placeholder="Phone number"
              maxLength={10}
              clearButtonMode="while-editing"
              keyboardType="phone-pad"
              onChangeText={this._changeText}
              onBlur={Keyboard.dismiss}
              keyboardAwareInput
              textAlign="center"
            />
            <View style={gstyles.flex1} />
          </View>
          <Button
            onPress={this._getLink}
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

Login.propTypes = {
  requestLogin: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(AuthActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Login);
