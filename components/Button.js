
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{alignSelf: 'stretch'}}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <View style={[
          {justifyContent: 'center', alignItems: 'center'},
          this.props.style,
          this.props.disabled ? {opacity: 0.3} : {}]}
        >
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  onPress: React.PropTypes.func,
  disabled: React.PropTypes.bool,
};

export default Button;
