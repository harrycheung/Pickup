
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  View
} from 'react-native';

import styles from './styles';
import { gstyles } from '../../config/styles';
import { time } from '../../helpers';
import AutoScrollView from '../AutoScrollView';

class PickupMessages extends React.Component {
  state: {
    messages: Object[],
    message: string,
    state: string,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      messages: [],
      message: '',
      state: '',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.pickup !== null;
  }

  render() {
    let messages = [];
    for (let messageKey in this.props.pickup.messages) {
      let message = this.props.pickup.messages[messageKey];
      message.key = messageKey;
      messages.push(this._renderMessage(message));
    }

    return (
      <View style={styles.container}>
        <View style={gstyles.flex1}>
          <AutoScrollView contentContainerStyle={styles.messagesContainer}>
            {messages}
          </AutoScrollView>
          <View style={styles.composeContainer}>
            <TextInput
              style={{height: 44, paddingHorizontal: 15}}
              placeholder='Send a message'
              returnKeyType='send'
              onChangeText={(text) => this.setState({message: text})}
              onSubmitEditing={this._postMessage.bind(this)}
              value={this.state.message}
            />
          </View>
        </View>
      </View>
    );
  }

  _renderMessage(message: Object) {
    let containerStyle = [styles.messageContainer];
    let messageStyle = [styles.message];
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
      case 'request':
        if (this.props.hideRequest) {
          return <View key='hiddenRequest' />;
        }

        const { students } = this.props.pickup;
        let studentsJSX = [];
        for (let studentKey in students) {
          const student = students[studentKey];
          studentsJSX.push((
            <View key={studentKey} style={styles.student}>
              <Image
                style={styles.studentImage}
                source={require('../../images/max.png')}
              />
              <Text style={styles.studentName}>
                {student.name}
              </Text>
            </View>
          ));
        }
        messageJSX = (
          <View style={styles.request}>
            <Text style={styles.messageText}>
              {message.sender.name} at the front gate
            </Text>
            {studentsJSX}
          </View>
        );
        break;

      case 'message':
        messageJSX = message.message;
        break;

      case 'escort':
        messageJSX = `${message.sender.name} is escorting ${message.student.name}`;
        break;

      case 'cancel':
        messageJSX = `${message.sender.name} canceled escort of ${message.student.name}`;
        break;

      case 'release':
        messageJSX = `${message.sender.name} released ${message.student.name} to ${this.props.pickup.requestor.name}`;
        break;
    }

    let senderJSX = null;
    if (sender !== null) {
      senderJSX = (
        <Image
          style={styles.senderImage}
          source={require('../../images/max.png')}
        />
      );
    }

    if (typeof messageJSX === 'string') {
      messageJSX = <Text style={styles.messageText}>{messageJSX}</Text>
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
    this.props.postMessage(this.props.pickup, this.props.user,
      {type: 'message', message: this.state.message}
    );
    this.setState({message: ''});
    Keyboard.dismiss();
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

export default PickupMessages;
