
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, ListView, Text, TextInput, View } from 'react-native';
import firebase from 'firebase';

import styles from './styles';
import AutoScrollView from '../AutoScrollView';
import KeyboardSpacer from '../KeyboardSpacer';
import Button from '../Button';

class Pickup extends React.Component {
  state: {
    messages: Object[],
    message: string,
    state: string,
    students: ListView.DataSource,
  };

  constructor(props: Object) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      messages: [],
      message: '',
      state: '',
      students: ds.cloneWithRows(this.props.pickup.students),
    };
  }

  componentDidMount() {
    const { pickup } = this.props;
    firebase.database().ref('/pickups/' + pickup.key)
    .on('value', (snapshot) => {
      if (snapshot.val() === null) {
        this.props.onClose();
      }
    });

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
          const hasKey = (element) => {
            return element.key === snapshot.key;
          };

          if (!this.state.messages.find(hasKey)) {
            let message = snapshot.val();
            message.key = snapshot.key;

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
    firebase.database().ref('/pickups/' + pickup.key).off();
    firebase.database().ref('/pickups/' + pickup.key + '/messages').off();
  }

  render() {
    let escortButtons = null;
    if (this.props.uid !== this.props.pickup.requestor) {
      switch (this.state.state) {
        case 'escorting':
          escortButtons = (
            <Button
              style={styles.escortButton}
              onPress={this._release.bind(this)}
            >
              <Text style={styles.escortButtonText}>
                Release
              </Text>
            </Button>
          );
          break;

        default:
          escortButtons = (
            <Button
              style={styles.escortButton}
              onPress={this._escort.bind(this)}
            >
              <Text style={styles.escortButtonText}>
                Escort
              </Text>
            </Button>
          );
      }
    }

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.students}
          renderRow={this._renderStudentRow.bind(this)}
          enableEmptySections={true}
        />
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

  _renderStudentRow(student, rowID, sectionID) {
    const fullName = (user) => `${user.firstName} ${user.lastInitial}`;
    
    return (
      <View key={student.key} style={styles.studentRow}>
        <View style={styles.student}>
          <Image
            style={styles.studentImage}
            source={require('../../images/max.png')}
          />
          <Text style={styles.studentName}>
            {fullName(student)}
          </Text>
        </View>
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

  _postMessage(message, callback) {
    let messageData = {
      type: 'message',
      sender: this.props.uid,
      createdAt: Date.now(),
      message: '',
    };
    if (message != null) {
      messageData.type = message;
    } else {
      messageData.message = this.state.message;
    }

    const { pickup } = this.props;
    firebase.database().ref('/pickups/' + pickup.key + '/messages')
    .push(messageData)
    .then((messageRef) => {
      this.setState({message: ''}, () => {
        callback && callback();
      });
    });
  }

  _escort() {
    Alert.alert(
      'Confirm escort',
      null,
      [
        {text: 'Cancel', onPress: null, style: 'cancel'},
        {text: 'OK', onPress: () => {
          this.setState({state: 'escorting'}, () => {
            this._postMessage('escort');
          });
        }}
      ],
      {cancelable: false}
    );
  }

  _release() {
    Alert.alert(
      'Confirm release',
      null,
      [
        {text: 'Cancel', onPress: null, style: 'cancel'},
        {text: 'OK', onPress: () => {
          firebase.database().ref('/pickups/' + this.props.pickup.key)
          .remove()
          .then(() => {
            this.componentWillUnmount();
            this.props.onComplete();
          });
        }}
      ],
      {cancelable: false}
    );
  }
}

 Pickup.propTypes = {
  uid: PropTypes.string.isRequired,
  pickup: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default Pickup;
