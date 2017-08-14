
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';

const LinedTextInput = props => (
  <TextInput
    {...props}
    underlineColorAndroid={props.borderBottomColor}
  />
);

LinedTextInput.propTypes = {
  borderBottomColor: PropTypes.string,
};

LinedTextInput.defaultProps = {
  borderBottomColor: 'blue',
};

export default LinedTextInput;
