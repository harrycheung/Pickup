
import React from 'react';
import { View } from 'react-native';

class LoginRequest extends React.Component {
  componentDidMount() {
    console.log(this.props.navigation.state.params.phoneNumber);
  }

  render() {
    return (
      <View />
    );
  }
}

export default LoginRequest;
