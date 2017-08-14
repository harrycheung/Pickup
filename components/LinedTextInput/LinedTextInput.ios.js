
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  view: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: 'darkgray',
  },
});

const LinedTextInput = (props: Object) => (
  <View style={[styles.view, { borderBottomColor: props.borderBottomColor }]}>
    <TextInput {...props} />
  </View>
);

LinedTextInput.propTypes = {
  borderBottomColor: PropTypes.string,
};

LinedTextInput.defaultProps = {
  borderBottomColor: 'blue',
};

export default LinedTextInput;
