
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, ViewPropTypes } from 'react-native';

import { colors } from '../../config/styles';

const LinedTextInput = props => (
  <TextInput
    {...props}
    style={[props.style, { height: 44, paddingLeft: 5, alignSelf: 'stretch' }]}
    selectionColor={'black'}
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
