
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, Text, TextInput, View } from 'react-native';

import styles from './styles';
import { gstyles } from '../../config/styles';
import { fullName } from '../../helpers';
import { FBref } from '../../helpers/firebase';
import AutoScrollView from '../AutoScrollView';
import KeyboardSpacer from '../KeyboardSpacer';
import { StudentCache } from '../../helpers';

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

  componentDidMount() {
    const { pickup } = this.props;
    FBref('/pickups/' + pickup.key).on('value', (snapshot) => {
      if (snapshot.val() === null) {
        this.props.onClose();
      }
    });

    const messagesRef = FBref('/pickups/' + pickup.key + '/messages');
    messagesRef.once('value').then((snapshot) => {
      let messages = [];
      snapshot.forEach((messageSnapshot) => {
        let message = messageSnapshot.val();
        message.key = messageSnapshot.key;
        messages.push(
          FBref('/users/' + message.sender).once('value').then((snapshot) => {
            const senderKey = message.sender;
            message.sender = snapshot.val();
            message.sender.key = senderKey;
            return message;
          })
        );
      });

      return Promise.all(messages);
    })
    .then((messages) => {
      this.setState({messages}, () => {
        messagesRef.limitToLast(1).on('child_added', (snapshot) => {
          const hasKey = (element) => {
            return element.key === snapshot.key;
          };

          if (!this.state.messages.find(hasKey)) {
            let message = snapshot.val();
            message.key = snapshot.key;

            FBref('/users/' + message.sender).once('value').then((snapshot) => {
              const senderKey = message.sender;
              message.sender = snapshot.val();
              message.sender['key'] = senderKey;
              let updatedMessages = this.state.messages.concat(message);
              this.setState({messages: updatedMessages});
            });
          }
        });
      });
    });
  }

  componentWillUnmount() {
    FBref('/pickups/' + this.props.pickup.key).off();
    FBref('/pickups/' + this.props.pickup.key + '/messages').off();
  }

  render() {
    const messages = this.state.messages.map((message) => this.renderMessage(message));

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
          <KeyboardSpacer />
        </View>
      </View>
    );
  }

  renderMessage(message: Object) {
    let containerStyle = [styles.messageContainer];
    let messageStyle = [styles.message];
    let sender = null;
    let messageJSX = 'Unknown message';

    if (message.sender.key === this.props.uid) {
      containerStyle.push(styles.right);
      messageStyle.push(styles.withoutSender);
    } else {
      containerStyle.push(styles.left);
      messageStyle.push(styles.withSender);
      sender = message.sender;
    }

    switch (message.type) {
      case 'request':
        const studentsJSX = this.props.pickup.students.map((student) => {
          return (
            <View key={student.key} style={styles.student}>
              <Image
                style={styles.studentImage}
                source={require('../../images/max.png')}
              />
              <Text style={styles.studentName}>
                {fullName(student)}
              </Text>
            </View>
          );
        });
        messageJSX = (
          <View style={styles.request}>
            <Text style={styles.messageText}>
              {fullName(message.sender)} at the front gate
            </Text>
            {studentsJSX}
          </View>
        );
        break;

      case 'message':
        messageJSX = message.message;
        break;

      case 'escort':
        messageJSX = `${fullName(message.sender)} is escorting Max C and Josh B to the front gate`;
        break;

      case 'release':
        messageJSX = `${fullName(message.sender)} released Max C and Josh B to Harry C`;
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
            {(new Date(message.createdAt)).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>
    );
  }

  _postMessage() {
    this.props.postMessage(this.props.pickup, this.props.uid, this.state.message);
    this.setState({message: ''});
  }
}

PickupMessages.propTypes = {
  uid: PropTypes.string.isRequired,
  pickup: PropTypes.object.isRequired,
  postMessage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default PickupMessages;
