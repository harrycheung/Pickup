
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewPropTypes,
} from 'react-native';

import { gstyles } from '../config/styles';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
  country: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  }
});

class PhoneInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this._changeText = this._changeText.bind(this);
  }

  state: {
    value: string,
  }

  _changeText(text) {
    let newValue = text.replace(/[()\s-]/g, '');
    if (this.state.value.slice(-1) === ')' && this.state.value.length - 1 === text.length) {
      newValue = newValue.slice(0, -1);
    }

    let value = this.state.value;
    if (newValue.length === 0) {
      value = '';
    } else if (newValue.length < 4) {
      value = `(${newValue})`;
    } else if (newValue.length < 7) {
      value = `(${newValue.slice(0, 3)}) ${newValue.slice(3)}`;
    } else if (newValue.length < 11) {
      value = `(${newValue.slice(0, 3)}) ${newValue.slice(3, 6)}-${newValue.slice(6)}`;
    }
    this.setState({ value });

    if (newValue.length === 10) {
      this.props.onEntered(newValue);
    }
  }

  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.inputContainer}>
          <Text style={styles.country}>+1</Text>
          <TextInput
            style={[gstyles.flex1, gstyles.textInput]}
            clearButtonMode="while-editing"
            keyboardType="phone-pad"
            textAlign="left"
            placeholder="Phone number"
            maxLength={14}
            keyboardAwareInput={this.props.keyboardAwareInput}
            value={this.state.value}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            onChangeText={this._changeText}
          />
        </View>
      </View>
    );
  }
}

PhoneInput.propTypes = {
  style: ViewPropTypes.style,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onEntered: PropTypes.func.isRequired,
  keyboardAwareInput: PropTypes.bool,
};

PhoneInput.defaultProps = {
  style: {},
  onFocus: () => {},
  onBlur: () => {},
  keyboardAwareInput: false,
};

export default PhoneInput;
