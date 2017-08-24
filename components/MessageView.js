
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BlurView } from 'expo';

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
    justifyContent: 'center',
  },
  background: {
    backgroundColor: 'black',
    opacity: 0.7,
  }
});

class MessageView extends React.Component {
  state = {
    fadeAnimationValue: new Animated.Value(0),
    message: '',
    duration: 1000,
  }

  componentWillMount() {
    // Because this component could get unmounted
    if (this.props.message !== '') {
      this._showMessage(this.props.message, this.props.duration);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message === '') {
      this.setState({ message: '', duration: 0 }, () => {
        this.state.fadeAnimationValue.setValue(0);
      });
    } else {
      this._showMessage(nextProps.message, nextProps.duration);
    }
  }

  _showMessage(message, duration) {
    this.setState({ message, duration }, () => {
      this.state.fadeAnimationValue.setValue(1);
      if (this.props.duration > 0) {
        Animated.timing(
          this.state.fadeAnimationValue,
          {
            toValue: 0,
            duration: this.props.duration,
          },
        ).start();
        this.state.fadeAnimationValue.addListener((value) => {
          if (value === 0) {
            this.props.clearMessage();
            this.state.fadeAnimationValue.removeAllListeners();
          }
        });
      }
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
        {this.state.message !== '' &&
          <View style={styles.container}>
            {this.state.duration === 0 && (
              (Platform.OS === 'ios' &&
                <BlurView style={styles.container} tint="light" intensity={70} />
              ) ||
              (Platform.OS === 'android' &&
                <View style={[styles.container, styles.background]} />
              ))
            }
            <Animated.View
              style={[styles.container, { opacity: this.state.fadeAnimationValue }]}
              pointerEvents="none"
            >
              <View style={styles.dialog}>
                <Text style={[{ color: 'white' }, gstyles.font18]}>
                  {this.state.message}
                </Text>
                {this.state.duration === 0 &&
                  <ActivityIndicator
                    style={{ margin: 15 }}
                    animating
                    color="white"
                    size="large"
                  />
                }
              </View>
            </Animated.View>
          </View>
        }
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
