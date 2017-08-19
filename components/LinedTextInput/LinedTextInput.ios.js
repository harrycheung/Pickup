
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, ViewPropTypes } from 'react-native';

import { gstyles } from '../../config/styles';

const LinedTextInput = (props: Object) => (
  <View
    style={[props.style, {
      height: 38,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: props.borderBottomColor,
    }]}
  >
    <TextInput {...props} style={gstyles.textInput} />
  </View>
);

LinedTextInput.propTypes = {
  style: ViewPropTypes.style,
  borderBottomColor: PropTypes.string,
};

LinedTextInput.defaultProps = {
  style: {},
  borderBottomColor: 'blue',
};

export default LinedTextInput;
