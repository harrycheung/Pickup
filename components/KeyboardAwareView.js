
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  LayoutAnimation,
  View,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const defaultAnimation = {
  duration: 500,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 200,
  },
};

class KeyboardAwareView extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func,
    style: View.propTypes.style,
    children: PropTypes.node,
  };

  static defaultProps = {
    onToggle: () => null,
    style: {},
    children: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      isKeyboardOpened: false,
    };
    this._listeners = null;
  }

  state: {
    offset: number,
    isKeyboardOpened: bool,
  };

  componentDidMount() {
    const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    this._listeners = [
      Keyboard.addListener(updateListener, this.updateOffset.bind(this)),
      Keyboard.addListener(resetListener, this.resetOffset.bind(this)),
    ];
  }

  componentWillUnmount() {
    this._listeners.forEach(listener => listener.remove());
  }

  updateOffset(event) {
    if (!event.endCoordinates) {
      return;
    }

    let animationConfig = defaultAnimation;
    if (Platform.OS === 'ios') {
      animationConfig = LayoutAnimation.create(
        event.duration,
        LayoutAnimation.Types[event.easing],
        LayoutAnimation.Properties.opacity,
      );
    }
    LayoutAnimation.configureNext(animationConfig);

    // get updated on rotation
    const screenHeight = Dimensions.get('window').height;
    // when external physical keyboard is connected
    // event.endCoordinates.height still equals virtual keyboard height
    // however only the keyboard toolbar is showing if there should be one
    const offset = -(screenHeight - event.endCoordinates.screenY);
    this.setState({
      offset,
      isKeyboardOpened: true,
    }, this.props.onToggle(true, offset));
  }

  resetOffset(event) {
    let animationConfig = defaultAnimation;
    if (Platform.OS === 'ios') {
      animationConfig = LayoutAnimation.create(
        event.duration,
        LayoutAnimation.Types[event.easing],
        LayoutAnimation.Properties.opacity,
      );
    }
    LayoutAnimation.configureNext(animationConfig);

    this.setState({
      offset: 0,
      isKeyboardOpened: false,
    }, this.props.onToggle(false, 0));
  }

  render() {
    return (
      <View style={[styles.container, { top: this.state.offset }, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

export default KeyboardAwareView;
