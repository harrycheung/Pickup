
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TextInput, View } from 'react-native';
import firebase from 'firebase';

import styles from './styles';
import AutoScrollView from '../AutoScrollView';
import KeyboardSpacer from '../KeyboardSpacer';

class PickupMessages extends React.Component {
  state: {
    messages: Object[],
    message: string,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      messages: [],
      message: '',
    };
  }

  componentDidMount() {
    const { pickup } = this.props;
    const messagesRef = firebase.database().ref(
      '/pickups/' + pickup.key + '/messages'
    );
    messagesRef.once('value').then((snapshot) => {
      let messages = [];

      snapshot.forEach((messageSnapshot) => {
        let message = messageSnapshot.val();
        message.key = messageSnapshot.key;
        messages.push(
          firebase.database().ref('/users/' + message.sender).once('value')
          .then((snapshot) => {
            const senderKey = message.sender;
            message.sender = snapshot.val();
            message.sender['key'] = senderKey;
            return message;
          })
        );
      });

      return Promise.all(messages);
    })
    .then((messages) => {
      this.setState({messages}, () => {
        messagesRef.limitToLast(1).on('child_added', (snapshot) => {
          const doesNotHasKey = (element, index, array) => {
            return element.key !== snapshot.key;
          };

          if (this.state.messages.some(doesNotHasKey)) {
            let message = snapshot.val();
            message['key'] = snapshot.key;

            firebase.database().ref('/users/' + message.sender).once('value')
            .then((snapshot) => {
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
    const { pickup } = this.props;
    const messagesRef = firebase.database().ref(
      '/pickups/' + pickup.key + '/messages'
    )
    .off();
  }

  render() {
    let escortButtons = null;
    if (this.props.uid !== this.props.pickup.requestor) {
      escortButtons = (
        <View style={styles.composeContainer}>
          <Text>escort stuff</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <AutoScrollView contentContainerStyle={styles.messagesContainer}>
            {this.state.messages.map((message) => this.renderMessage(message))}
          </AutoScrollView>
        </View>
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
        {escortButtons}
        <KeyboardSpacer />
      </View>
    );
  }

  renderMessage(message: Object) {
    const fullName = (user) => `${user.firstName} ${user.lastInitial}`;

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
        const students = this.props.pickup.students.map((student) => {
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
            {students}
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
      <View key={message.createdAt} style={containerStyle}>
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
    const { pickup } = this.props;
    const messagesRef = firebase.database().ref(
      '/pickups/' + pickup.key + '/messages'
    );
    messagesRef.push({
      type: 'message',
      sender: this.props.uid,
      createdAt: Date.now(),
      message: this.state.message,
    })
    .then((messageRef) => {
      this.setState({message: ''});
    });
  }
}

PickupMessages.propTypes = {
  uid: PropTypes.string.isRequired,
  pickup: PropTypes.object.isRequired,
};

export default PickupMessages;
