
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../config/styles';
import { Actions as MessageActions } from '../actions/Message';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'darkgray',
    alignItems: 'center',
  },
});

class MessageView extends React.Component {
  state = {
    fadeAnimationValue: new Animated.Value(0),
    message: '',
  }

  componentWillMount() {
    // Because this component could get unmounted
    if (this.props.message !== '') {
      this._showMessage(this.props.message);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== '') {
      this._showMessage(nextProps.message);
    }
  }

  _showMessage(message) {
    this.setState({ message }, () => {
      this.state.fadeAnimationValue.setValue(1);
      if (this.props.duration > 0) {
        Animated.timing(
          this.state.fadeAnimationValue,
          {
            toValue: 0,
            duration: this.props.duration,
          },
        ).start();
      }
      this.props.clearMessage();
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
        <Animated.View
          style={[styles.container, { opacity: this.state.fadeAnimationValue }]}
          pointerEvents="none"
        >
          <View style={styles.dialog}>
            <Text style={[{ color: 'white' }, gstyles.font18]}>
              {this.state.message}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

MessageView.propTypes = {
  style: ViewPropTypes.style,
  message: PropTypes.string,
  duration: PropTypes.number,
  clearMessage: PropTypes.func.isRequired,
  children: PropTypes.node,
};

MessageView.defaultProps = {
  style: {},
  message: '',
  duration: 0,
  children: null,
};

const mapStateToProps = state => ({
  message: state.message.message,
  duration: state.message.duration,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(MessageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageView);
