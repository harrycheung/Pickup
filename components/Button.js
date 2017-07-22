
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../config/styles';

class Button extends React.Component {
  render() {
    let { content } = this.props;
    if (typeof this.props.content === 'string') {
      content = (
        <Text
          style={{
            fontSize: this.props.textSize || 18,
            color: colors.buttonText,
          }}
        >
          {this.props.content}
        </Text>
      )
    }
    return (
      <TouchableOpacity
        style={[
          { height: 44 },
          this.props.disabled ? {opacity: 0.3} : {},
          this.props.style,
        ]}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {content}
        </View>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  content: PropTypes.any,
  textSize: PropTypes.number,
  maxHeight: PropTypes.number,
};

export default Button;
