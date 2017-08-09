
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Actions as MessageActions } from '../actions/Message';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'darkgray',
    alignItems: 'center',
  },
  message: {
    color: 'white',
  },
});

class MessageView extends React.Component {
  state = {
    fadeAnimationValue: new Animated.Value(0),
    message: '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== '') {
      this.setState({ message: nextProps.message }, () => {
        this.state.fadeAnimationValue.setValue(1);
        Animated.timing(
          this.state.fadeAnimationValue,
          {
            toValue: 0,
            duration: this.props.duration,
          },
        ).start();
      });
      this.props.clearMessage();
    }
  }

  render() {
    return (
      <View style={this.props.style}>
        <Animated.View style={[styles.container, { opacity: this.state.fadeAnimationValue }]}>
          <Text style={styles.message}>
            {this.state.message}
          </Text>
        </Animated.View>
        {this.props.children}
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
