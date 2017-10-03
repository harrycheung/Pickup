
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
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
  static propTypes = {
    style: ViewPropTypes.style,
    children: PropTypes.node,
    centerOnInput: PropTypes.bool,
    aboveFoldInput: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
    children: null,
    centerOnInput: false,
    aboveFoldInput: false,
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
      LayoutAnimation.configureNext(animationConfig);
    }

    if (!this.props.centerOnInput && !this.props.aboveFoldInput) {
      const screenHeight = Dimensions.get('window').height;
      // const screenHeight = Dimensions.get('window').height;
      // when external physical keyboard is connected
      // event.endCoordinates.height still equals virtual keyboard height
      // however only the keyboard toolbar is showing if there should be one
      const offset = -(screenHeight - event.endCoordinates.screenY);
      this.setState({
        offset,
        isKeyboardOpened: true,
      });
    } else if (this._focusedInput) {
      this._focusedInput.measure((x, y, w, h, px, py) => {
        let offset = this.state.offset;
        if (this.props.centerOnInput) {
          offset = -(py - ((event.endCoordinates.screenY - h) / 2));
        } else if (this.props.aboveFoldInput) {
          if ((py + h) > event.endCoordinates.screenY) {
            offset = -((py + h) - event.endCoordinates.screenY);
          }
        }
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
      LayoutAnimation.configureNext(animationConfig);
    }

    this.setState({
      offset: 0,
      isKeyboardOpened: false,
    });
    this._focusedInput = null;
  }

  _onFocus(event) {
    this._focusedInput = ReactNativeComponentTree.getInstanceFromNode(event.currentTarget);
  }

  renderChildren(props) {
    if (props.children) {
      const children = React.Children.map(props.children, (child) => {
        if (child && child.props) {
          if (child.props.keyboardAwareInput) {
            return React.cloneElement(child, {
              onFocus: (event) => {
                this._onFocus(event);
                if (child.props.onFocus) {
                  child.props.onFocus(event);
                }
              },
            });
          }

          if (child.props.children) {
            return React.cloneElement(child, null, this.renderChildren(child.props));
          }
        }
        return child;
      });
      return children.length === 1 ? children[0] : children;
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, { top: this.state.offset }, this.props.style]}>
        {this.renderChildren(this.props)}
      </View>
    );
  }
}

export default KeyboardAwareView;
