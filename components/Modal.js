
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Button from './Button';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    minWidth: '70%',
    minHeight: '25%',
    borderRadius: 10,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  message: {
    fontSize: 18,
  },
  button: {
    height: 44,
  },
  buttonText: {
    fontSize: 18,
    color: '#007aff',
  },
});

class CustomModal extends React.Component {
  static defaultProps = {
    color: 'black',
    backgroundColor: 'white',
  };

  render() {
    return (
      <Modal
        animationType={'slide'}
        transparent
        {...this.props}
      >
        <View style={styles.background} />
        <View style={styles.container}>
          <View style={[styles.dialog, { backgroundColor: this.props.backgroundColor }]}>
            <View style={styles.messageContainer}>
              <Text style={[styles.message, { color: this.props.color }]}>
                {this.props.message}
              </Text>
            </View>
            <Button
              style={styles.button}
              onPress={this.props.onPressOK}
              content="OK"
            />
          </View>
        </View>
      </Modal>
    );
  }
}

CustomModal.propTypes = {
  onPressOK: PropTypes.func.isRequired,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  message: PropTypes.string,
};

CustomModal.defaultProps = {
  message: '',
};

export default CustomModal;
