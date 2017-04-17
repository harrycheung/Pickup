
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import styles from './styles';
import { colors } from '../../config/styles';
import Button from '../../components/Button';
import { actions as AuthActions } from '../../actions/auth';
import { actions as NavigationActions } from '../../actions/navigation';
import LinedTextInput from '../../components/LinedTextInput';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {disabled: true, phoneNumber: ''};
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
    if (text.length == 10) {
      this.setState({disabled: false, phoneNumber: text});
    } else {
      this.setState({disabled: true});
    }
  }

  _login = () => {
    this.props.login(this.state.phoneNumber);
    this.props.loginRequest(this.state.phoneNumber);
  }
}

Login.propTypes = {
  login: React.PropTypes.func.isRequired,
  loginRequest: React.PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
  ...bindActionCreators(NavigationActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Login);
