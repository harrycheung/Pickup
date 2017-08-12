
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  ColorPropType,
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  button: Platform.select({
    ios: {},
    android: {
      elevation: 4,
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  text: Platform.select({
    ios: {
      // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
      color: '#007AFF',
      textAlign: 'center',
      padding: 8,
      fontSize: 18,
    },
    android: {
      color: 'white',
      textAlign: 'center',
      padding: 8,
      fontWeight: '500',
    },
  }),
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    },
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
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
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];

    let buttonColor = 'white';
    if (color) {
      if (Platform.OS === 'ios') {
        buttonColor = color;
      } else {
        buttonStyles.push({ backgroundColor: color });
      }
    }
    const accessibilityTraits = ['button'];
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
      accessibilityTraits.push('disabled');
    }

    const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

    return (
      <Touchable
        accessibilityComponentType="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityTraits={accessibilityTraits}
        testID={testID}
        disabled={disabled}
        onPress={onPress}
      >
        <View style={buttonStyles}>
          <Icon name={icon} size={24} color={buttonColor} />
        </View>
      </Touchable>
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
