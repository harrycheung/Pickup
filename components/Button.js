
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
            paddingHorizontal: 10,
          }}
        >
          {this.props.content}
        </Text>
      );
    }
    return (
      <View style={[{ height: 44 }, gstyles.flexStretch, this.props.style]}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
          }}
        />
        <TouchableOpacity
          style={gstyles.flex1}
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
      </View>
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
