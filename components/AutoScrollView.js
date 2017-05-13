
// https://github.com/fritx/react-native-auto-scroll
// UX Interactions kept consistent with Wechat App
// @flow

import React from 'react';
import { Keyboard, Platform, ScrollView } from 'react-native';

class AutoScrollView extends React.Component {
  contentHeight: number = 0;
  scrollHeight: number = 0;
  scrollY: number = 0;
  keyboardShow: Object;
  keyboardHide: Object;

  componentDidMount() {
    this.keyboardShow = Keyboard.addListener(
      'keyboardDidShow', this.handleKeyboardShow.bind(this)
    );
    this.keyboardHide = Keyboard.addListener(
      'keyboardDidHide', this.handleKeyboardHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardShow.remove();
    this.keyboardHide.remove();
  }

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
        this.refs.scroller.scrollTo({y: 0});
      }
      // fix bottom blank if exsits
      // else {
      //   this.scrollToBottom()
      // }
      else {
        this.refs.scroller.scrollTo({y: scrollY});
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
    if (h === this.contentHeight) return
    this.contentHeight = h

    if (this.scrollHeight == null) {
      setTimeout(() => {
        this.scrollToBottomIfNecessary();
      }, 500)
    }
    else {
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
      this.refs.scroller.scrollTo({y: contentHeight - scrollHeight});
    }
  }

  render() {
    return (
      <ScrollView ref="scroller"
        scrollEventThrottle={16}
        onScroll={this.handleScroll.bind(this)}
        onLayout={this.handleLayout.bind(this)}
        onContentSizeChange={this.handleContentChange.bind(this)}
        {...this.props}>
      </ScrollView>
    );
  }
}

export default AutoScrollView;
