
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  View,
} from 'react-native';

import styles from './styles';
import { gstyles } from '../../config/styles';
import { time } from '../../helpers';
import AutoScrollView from '../AutoScrollView';

class PickupMessages extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      messages: [],
      message: '',
      state: '',
    };

    this._postMessage = this._postMessage.bind(this);
  }

  state: {
    messages: Object[],
    message: string,
    state: string,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.pickup !== null;
  }

  _renderMessage(message: Object) {
    const containerStyle = [styles.messageContainer];
    const messageStyle = [styles.message];
    let sender = null;
    let messageJSX = 'Unknown message';

    if (message.sender.uid === this.props.user.uid) {
      containerStyle.push(styles.right);
      messageStyle.push(styles.withoutSender);
    } else {
      containerStyle.push(styles.left);
      messageStyle.push(styles.withSender);
      sender = message.sender;
    }

    switch (message.type) {
      case 'request': {
        if (this.props.hideRequest) {
          return <View key="hiddenRequest" />;
        }

        const studentsJSX = [];
        Object.keys(this.props.pickup.students).forEach((key) => {
          const student = this.props.pickup.students[key];
          studentsJSX.push((
            <View key={key} style={styles.student}>
              <Image style={styles.studentImage} source={{ uri: student.image }} />
              <Text style={styles.studentName}>
                {student.name}
              </Text>
            </View>
          ));
        });
        messageJSX = (
          <View style={styles.request}>
            <Text style={styles.messageText}>
              {message.sender.name} at the front gate
            </Text>
            {studentsJSX}
          </View>
        );
        break;
      }
      case 'message': {
        messageJSX = message.message;
        break;
      }
      case 'escort': {
        messageJSX = `${message.sender.name} is escorting ${message.student.name}`;
        break;
      }
      case 'cancel': {
        messageJSX = `${message.sender.name} canceled escort of ${message.student.name}`;
        break;
      }
      case 'release': {
        messageJSX = `${message.sender.name} released ${message.student.name} to ${this.props.pickup.requestor.name}`;
        break;
      }
      default:
    }

    let senderJSX = null;
    if (sender !== null) {
      senderJSX = <Image style={styles.senderImage} source={{ uri: sender.image }} />;
    }

    if (typeof messageJSX === 'string') {
      messageJSX = <Text style={styles.messageText}>{messageJSX}</Text>;
    }

    return (
      <View key={message.key} style={containerStyle}>
        {senderJSX}
        <View style={messageStyle}>
          {messageJSX}
          <Text style={styles.timestamp}>
            {time(message.createdAt)}
          </Text>
        </View>
      </View>
    );
  }

  _postMessage() {
    this.props.postMessage(
      this.props.pickup,
      this.props.user,
      { type: 'message', message: this.state.message },
    );
    this.setState({ message: '' });
    Keyboard.dismiss();
  }

  render() {
    const messages = [];
    Object.keys(this.props.pickup.messages || {}).forEach((key) => {
      const message = this.props.pickup.messages[key];
      message.key = key;
      messages.push(this._renderMessage(message));
    });

    return (
      <View style={gstyles.flex1}>
        <AutoScrollView contentContainerStyle={styles.messagesContainer}>
          {messages}
        </AutoScrollView>
        <View style={styles.composeContainer}>
          <TextInput
            style={{ height: 44, paddingHorizontal: 15 }}
            placeholder="Send a message"
            returnKeyType="send"
            onChangeText={text => this.setState({ message: text })}
            onSubmitEditing={this._postMessage}
            value={this.state.message}
          />
        </View>
      </View>
    );
  }
}

PickupMessages.propTypes = {
  user: PropTypes.object.isRequired,
  pickup: PropTypes.object.isRequired,
  postMessage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  hideRequest: PropTypes.bool,
};

PickupMessages.defaultProps = {
  hideRequest: false,
};

export default PickupMessages;
