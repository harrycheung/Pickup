
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

class LinedTextInput extends React.Component {
  render() {
    console.log(this.props);
    return (
      <View style={[styles.view, {borderBottomColor: this.props.borderBottomColor}]}>
        <TextInput {...this.props} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  view: {
    alignSelf: 'stretch',
    borderBottomWidth: 2,
    borderBottomColor: '#ff0000',
  },
});

export default LinedTextInput;
