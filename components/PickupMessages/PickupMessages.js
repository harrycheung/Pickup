
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
      message: '',
    };

    this._postMessage = this._postMessage.bind(this);
  }

  state: {
    message: string,
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
          let studentStyle = {};
          if (student.released) {
            studentStyle = styles.released;
          } else if (student.escort.uid !== '') {
            studentStyle = styles.escort;
          }
          studentsJSX.push((
            <View key={key} style={styles.student}>
              <Image
                style={[gstyles.profilePic50, studentStyle]}
                source={{ uri: student.image }}
              />
              <Text style={styles.studentName}>
                {student.name}
              </Text>
            </View>
          ));
        });
        messageJSX = (
          <View style={styles.request}>
            <Text style={styles.messageText}>
              {message.sender.name} at {this.props.pickup.location} in {this.props.pickup.vehicle}
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

    return (
      <View key={message.key} style={containerStyle}>
        {sender !== null &&
          <Image style={styles.senderImage} source={{ uri: sender.image }} />
        }
        <View style={messageStyle}>
          {typeof messageJSX === 'string' ?
            <Text style={styles.messageText}>{messageJSX}</Text>
            :
            messageJSX
          }
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
  hideRequest: PropTypes.bool,
};

PickupMessages.defaultProps = {
  hideRequest: false,
};

export default PickupMessages;
