
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  LayoutAnimation,
  View,
  Platform,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import ReactNativeComponentTree from 'ReactNativeComponentTree';

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
  static findInputs = (props) => {
    React.Children.map(props.children, (node) => {
      // const component = node.getWrappedInstance ? node.getWrappedInstance() : node;
      if (node) {
        if (node.props) {
          if (node.props.children) {
            console.log('go deeper');
            KeyboardAwareView.findInputs(node.props);
          }
          if (node.props.keyboardAwareInput) {
            console.log('DISPLAY', Object.keys(node.ref));
          }
        }
      }
    });
  };

  static propTypes = {
    style: ViewPropTypes.style,
    children: PropTypes.node,
  };

  static defaultProps = {
    style: {},
    children: null,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      offset: 0,
      isKeyboardOpened: false,
    };

    this._listeners = [];
    this._focusedInput = null;
    this._onFocus = this._onFocus.bind(this);
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

  _listeners = [];
  _focusedInput = null;

  updateOffset(event: Object) {
    console.log('updateOffset');
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
    // const screenHeight = Dimensions.get('window').height;
    // when external physical keyboard is connected
    // event.endCoordinates.height still equals virtual keyboard height
    // however only the keyboard toolbar is showing if there should be one
    // const offset = -(screenHeight - event.endCoordinates.screenY);
    // this.setState({
    //   offset,
    //   isKeyboardOpened: true,
    // }, this.props.onToggle(true, offset));

    if (this._focusedInput) {
      this._focusedInput.measure((x, y, w, h, px, py) => {
        const offset = this.state.offset - (py - ((event.endCoordinates.screenY - h) / 2));
        this.setState({
          offset,
          isKeyboardOpened: true,
        });
      });
    }
  }

  resetOffset(event: Object) {
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
    });
  }

  _onFocus(event) {
    console.log('onFocus');
    this._focusedInput = ReactNativeComponentTree.getInstanceFromNode(event.currentTarget);
  }

  renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      if (child.props.keyboardAwareInput) {
        return React.cloneElement(child, {
          onFocus: this._onFocus,
        });
      }
      return child;
    });
  }

  render() {
    return (
      <View style={[styles.container, { top: this.state.offset }, this.props.style]}>
        {this.renderChildren()}
      </View>
    );
  }
}

export default KeyboardAwareView;
