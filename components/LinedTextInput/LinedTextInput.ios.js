
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  view: {
    alignSelf: 'stretch',
    borderBottomWidth: 2,
    borderBottomColor: '#ff0000',
  },
});

class LinedTextInput extends React.Component {
  render() {
    return (
      <View style={[styles.view, { borderBottomColor: this.props.borderBottomColor }]}>
        <TextInput {...this.props} />
      </View>
    );
  }
}

LinedTextInput.propTypes = {
  borderBottomColor: PropTypes.string,
};

LinedTextInput.defaultProps = {
  borderBottomColor: 'blue',
};

export default LinedTextInput;
