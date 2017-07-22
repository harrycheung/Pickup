
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
        style={[{ height: 44, alignSelf: 'stretch' }, this.props.style]}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <View
          style={[
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
            this.props.disabled ? {opacity: 0.3} : {},
            { backgroundColor: this.props.backgroundColor || colors.buttonBackground },
          ]}
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
  content: PropTypes.any,
  textSize: PropTypes.number,
  backgroundColor: PropTypes.string,
};

export default Button;
