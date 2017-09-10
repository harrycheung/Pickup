
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, ViewPropTypes } from 'react-native';

import { colors, gstyles } from '../../config/styles';

class LinedTextInput extends React.Component {
  blur() {
    this.textInput.blur();
  }

  render() {
    return (
      <TextInput
        ref={(input) => { this.textInput = input; }}
        {...this.props}
        style={[this.props.style, gstyles.flexStretch, { height: 44, paddingLeft: 5 }]}
        selectionColor="black"
        underlineColorAndroid={this.props.borderBottomColor}
      />
    );
  }
}

LinedTextInput.propTypes = {
  style: ViewPropTypes.style,
  borderBottomColor: PropTypes.string,
};

LinedTextInput.defaultProps = {
  style: {},
  borderBottomColor: colors.buttonBackground,
};

export default LinedTextInput;
