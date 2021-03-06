
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BlurView } from 'expo';

import { colors, gstyles } from '../config/styles';
import IPhoneXSpacer from './IPhoneXSpacer';
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
    maxWidth: '50%',
    backgroundColor: 'darkgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: 'black',
    opacity: 0.5,
  },
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
    if (this.props.message !== nextProps.message) {
      if (nextProps.message === '') {
        this.setState({ message: '', duration: 0 }, () => {
          this.state.fadeAnimationValue.setValue(0);
        });
      } else {
        this._showMessage(nextProps.message, nextProps.duration);
      }
    }
  }

  _showMessage(message, duration) {
    this.setState({ message, duration }, () => {
      this.state.fadeAnimationValue.setValue(1);
      if (this.state.duration > 0) {
        Animated.timing(
          this.state.fadeAnimationValue,
          {
            toValue: 0,
            delay: this.state.duration,
            duration: 200,
          },
        ).start();
        this.state.fadeAnimationValue.addListener((event) => {
          if (event.value === 0) {
            this.state.fadeAnimationValue.removeAllListeners();
            this.props.clearMessage();
          }
        });
      }
    });
  }

  render() {
    const renderChildren = Platform.OS === 'ios' || this.state.message === '';
    return (
      <SafeAreaView style={this.props.style}>
        <StatusBar
          backgroundColor={colors.buttonBackground}
          barStyle="light-content"
        />
        {renderChildren &&
          this.props.children
        }
        {this.state.message !== '' &&
          <View style={styles.container}>
            {Platform.OS === 'ios' &&
              <BlurView style={styles.container} tint="light" intensity={70} />
            }
            {Platform.OS === 'android' &&
              <View style={[styles.container, styles.background]} />
            }
            <Animated.View
              style={[styles.container, { opacity: this.state.fadeAnimationValue }]}
              pointerEvents="none"
            >
              <View style={styles.dialog}>
                <Text style={[{ color: 'white', textAlign: 'center' }, gstyles.font18]}>
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
      </SafeAreaView>
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
