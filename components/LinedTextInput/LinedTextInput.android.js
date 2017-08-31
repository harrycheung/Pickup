
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, ViewPropTypes } from 'react-native';

import { colors, gstyles } from '../../config/styles';

const LinedTextInput = props => (
  <TextInput
    {...props}
    style={[props.style, gstyles.flexStretch, { height: 44, paddingLeft: 5 }]}
    selectionColor="black"
    underlineColorAndroid={props.borderBottomColor}
  />
);

LinedTextInput.propTypes = {
  style: ViewPropTypes.style,
  borderBottomColor: PropTypes.string,
};

LinedTextInput.defaultProps = {
  style: {},
  borderBottomColor: colors.buttonBackground,
};

export default LinedTextInput;
