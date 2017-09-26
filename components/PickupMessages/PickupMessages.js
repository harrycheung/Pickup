
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Keyboard,
  Text,
  View,
} from 'react-native';
import { MapView } from 'expo';
import moment from 'moment';

import styles from './styles';
import { gstyles } from '../../config/styles';
import CachedImage from '../../components/CachedImage';

class PickupMessages extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      message: '',
      fromNow: moment(props.pickup.createdAt).fromNow(),
    };

    this._postMessage = this._postMessage.bind(this);
    this._release = this._release.bind(this);

    this.timer = setInterval(
      () => {
        this.setState({ fromNow: moment(props.pickup.createdAt).fromNow() });
      },
      30000,
    );
  }

  state: {
    message: string,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.pickup !== null;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer: number;

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
              <CachedImage
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
              {message.sender.name} at {this.props.pickup.location}
              {this.props.pickup.location !== 'Playground' &&
                ` in ${this.props.pickup.vehicle}`
              }
            </Text>
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
          <CachedImage style={styles.senderImage} source={{ uri: sender.image }} />
        }
        <View style={messageStyle}>
          {typeof messageJSX === 'string' ?
            <Text style={styles.messageText}>{messageJSX}</Text>
            :
            messageJSX
          }
          <Text style={styles.timestamp}>
            {moment(message.createdAt).format('LT')}
          </Text>
        </View>
      </View>
    );
  }

  _release(pickup, student) {
    Alert.alert(
      'Confirm release',
      null,
      [
        { text: 'Cancel', onPress: null, style: 'cancel' },
        { text: 'OK',
          onPress: () => this.props.releaseStudent(pickup, this.props.user, student),
        },
      ],
      { cancelable: false },
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
    const { pickup, user } = this.props;
    const students = [];
    Object.keys(pickup.students).forEach((key) => {
      const student = pickup.students[key];
      const escort = student.escort.uid === user.uid;
      let actions = [];
      if (student.released) {
        actions = [(
          <Text key="released" style={gstyles.font14}>
            released by {escort ? 'You' : student.escort.name}
          </Text>
        )];
      } else if (escort) {
        actions = [(
          <Button
            key="cancel"
            style={gstyles.flex1}
            onPress={() => this.props.cancelEscort(pickup, user, student)}
            title="Cancel"
            color="darkgray"
          />
        ), (
          <View key="spacer" style={gstyles.width10} />
        ), (
          <Button
            key="release"
            style={gstyles.flex1}
            onPress={() => this._release(pickup, student)}
            title="Release"
          />
        )];
      } else if (user.admin && student.escort.uid === '') {
        actions = [(
          <Button
            key="escort"
            style={gstyles.flex1}
            onPress={() => this.props.escortStudent(pickup, user, student)}
            title="Escort"
          />
        )];
      } else if (!user.admin && student.escort.uid === '') {
        actions = [<Text key="waiting" style={gstyles.font14}>waiting</Text>];
      } else {
        actions = [(
          <CachedImage
            key="image"
            style={[gstyles.profilePic50, { marginHorizontal: 5 }]}
            source={{ uri: student.escort.image }}
          />
        ),(
          <Text key="name" style={gstyles.font16}>
            {student.escort.name}
          </Text>
        )];
      }

      students.push((
        <View
          key={student.key}
          style={[gstyles.flexCenter, styles.studentRequest]}
        >
          <View style={[gstyles.flex1, gstyles.flexRow]}>
            <CachedImage
              style={gstyles.profilePic50}
              source={{ uri: student.image }}
            />
            <Text style={[gstyles.font16, { marginLeft: 5, alignSelf: 'center' }]}>
              {student.name} ({student.grade})
            </Text>
          </View>
          <View style={[gstyles.flex1, styles.actionsContainer, gstyles.flexCenter]}>
            {actions}
          </View>
        </View>
      ));
    });

    const messages = [];
    Object.keys(pickup.messages || {}).forEach((key) => {
      const message = pickup.messages[key];
      message.key = key;
      messages.push(this._renderMessage(message));
    });

    return (
      <View style={gstyles.flex1}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
            padding: 15,
          }}
        >
          <CachedImage
            style={gstyles.profilePic80}
            source={{ uri: pickup.requestor.image }}
          />
          <View style={[gstyles.flex1, { marginLeft: 10 }]}>
            <Text
              style={{
                alignSelf: 'flex-end',
              }}
            >
              {moment(pickup.createdAt).format('LT')} ({this.state.fromNow})
            </Text>
            <View style={gstyles.flex1} />
            <Text style={gstyles.font16}>
              {pickup.requestor.name} at {pickup.location}
              {pickup.location !== 'Playground' &&
                ` in ${pickup.vehicle}`
              }
            </Text>
          </View>
        </View>
        <View style={[gstyles.flexRow, gstyles.marginTop10]}>
          <View style={gstyles.flex1} />
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Text style={styles.font14}>
              escorted by
            </Text>
          </View>
        </View>
        <View style={styles.students}>
          {students}
        </View>
        <MapView
          style={{ flex: 1 }}
          mapType="hybrid"
          rotateEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          cacheEnabled
          loadingEnabled
          region={{
            latitude: pickup.coordinates.latitude,
            longitude: pickup.coordinates.longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.00005,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: pickup.coordinates.latitude,
              longitude: pickup.coordinates.longitude,
            }}
          />
        </MapView>
      </View>
    );
    //     <AutoScrollView contentContainerStyle={styles.messagesContainer}>
    //       {messages}
    //     </AutoScrollView>
    //     <View style={styles.composeContainer}>
    //       <TextInput
    //         style={{ height: 44, paddingHorizontal: 15 }}
    //         placeholder="Send a message"
    //         returnKeyType="send"
    //         onChangeText={text => this.setState({ message: text })}
    //         onSubmitEditing={this._postMessage}
    //         value={this.state.message}
    //       />
    //     </View>
    //   </View>
    // );
  }
}

PickupMessages.propTypes = {
  user: PropTypes.object.isRequired,
  pickup: PropTypes.object.isRequired,
  postMessage: PropTypes.func.isRequired,
  hideRequest: PropTypes.bool,
  cancelEscort: PropTypes.func,
  escortStudent: PropTypes.func,
  releaseStudent: PropTypes.func,
};

PickupMessages.defaultProps = {
  hideRequest: false,
  cancelEscort: () => {},
  escortStudent: () => {},
  releaseStudent: () => {},
};

export default PickupMessages;
