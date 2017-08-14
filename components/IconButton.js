
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  ColorPropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    },
  }),
});

class IconButton extends React.Component {
  render() {
    const {
      accessibilityLabel,
      color,
      icon,
      onPress,
      disabled,
      testID,
    } = this.props;

    const accessibilityTraits = ['button'];
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
      accessibilityTraits.push('disabled');
    }

    const Touchable = TouchableOpacity;

    return (
      <TouchableOpacity
        accessibilityComponentType="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityTraits={accessibilityTraits}
        testID={testID}
        disabled={disabled}
        onPress={onPress}
      >
        <Icon name={icon} size={24} color={color} />
      </TouchableOpacity>
    );
  }
}

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  accessibilityLabel: PropTypes.string,
  color: ColorPropType,
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  testID: PropTypes.string,
};

IconButton.defaultProps = {
  accessibilityLabel: '',
  color: '#007AFF',
  disabled: false,
  testID: '',
};

export default IconButton;
