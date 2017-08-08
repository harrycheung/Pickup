
// https://github.com/fritx/react-native-auto-scroll
// UX Interactions kept consistent with Wechat App
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Platform, ScrollView } from 'react-native';

class AutoScrollView extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.handleLayout = this.handleLayout.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  componentDidMount() {
    this.keyboardShow = Keyboard.addListener(
      'keyboardDidShow', this.handleKeyboardShow.bind(this),
    );
    this.keyboardHide = Keyboard.addListener(
      'keyboardDidHide', this.handleKeyboardHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardShow.remove();
    this.keyboardHide.remove();
  }

  contentHeight: number = 0;
  scrollHeight: number = 0;
  scrollY: number = 0;
  keyboardShow: Object;
  keyboardHide: Object;

  // todo: handle layout instead of keyboard
  handleKeyboardShow() {
    this.scrollToBottom();
  }

  handleKeyboardHide() {
    const { scrollY, scrollHeight, contentHeight } = this;

    // fix iOS bouncing scroll effect
    if (Platform.OS === 'ios') {
      // fix top blank if exsits
      // detection also has trouble on Android
      if (scrollY > contentHeight - scrollHeight) {
        this.refs.scroller.scrollTo({ y: 0 });
      }
      // fix bottom blank if exsits
      // else {
      //   this.scrollToBottom()
      // }
      else {
        this.refs.scroller.scrollTo({ y: scrollY });
      }
    }
  }

  handleScroll(e: Object) {
    this.scrollY = e.nativeEvent.contentOffset.y;
  }

  handleLayout(e: Object) {
    this.scrollHeight = e.nativeEvent.layout.height;
  }

  handleContentChange(w: number, h: number) {
    // repeated called on Android
    // should do diff
    if (h === this.contentHeight) return;
    this.contentHeight = h;

    if (this.scrollHeight == null) {
      setTimeout(() => {
        this.scrollToBottomIfNecessary();
      }, 500);
    } else {
      this.scrollToBottomIfNecessary();
    }
  }

  scrollToBottomIfNecessary() {
    // todo: range detection
    this.scrollToBottom();
  }

  scrollToBottom() {
    const { scrollHeight, contentHeight } = this;
    if (scrollHeight == null) {
      return;
    }
    if (contentHeight > scrollHeight) {
      this.refs.scroller.scrollTo({ y: contentHeight - scrollHeight });
    }
  }

  render() {
    return (
      <ScrollView
        ref="scroller"
        scrollEventThrottle={16}
        onScroll={this.handleScroll}
        onLayout={this.handleLayout}
        onContentSizeChange={this.handleContentChange}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}

AutoScrollView.propTypes = {
  children: PropTypes.node,
};

AutoScrollView.defaultProps = {
  children: null,
};

export default AutoScrollView;
