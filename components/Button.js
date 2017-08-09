
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';

import { colors, gstyles } from '../config/styles';

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
      );
    }
    return (
      <TouchableOpacity
        style={[{ height: 44, alignSelf: 'stretch' }, this.props.style]}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <View
          style={[
            gstyles.flex1,
            gstyles.flexCenter,
            this.props.disabled ? { opacity: 0.3 } : {},
            { backgroundColor: this.props.backgroundColor },
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
  style: ViewPropTypes.style,
};

Button.defaultProps = {
  onPress: () => {},
  disabled: false,
  content: '',
  textSize: 18,
  backgroundColor: colors.buttonBackground,
  style: {},
};

export default Button;
