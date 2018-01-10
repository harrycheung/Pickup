
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MapView } from 'expo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

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

        const studentsJSX = Object.keys(this.props.pickup.students).map((key) => {
          const student = this.props.pickup.students[key];
          let studentStyle = {};
          if (student.released) {
            studentStyle = styles.released;
          } else if (student.escort.uid !== '') {
            studentStyle = styles.escort;
          }
          return (
            <View key={key} style={styles.student}>
              <CachedImage
                style={[gstyles.profilePic50, studentStyle]}
                source={{ uri: student.image }}
              />
              <Text style={styles.studentName}>
                {student.name}
              </Text>
            </View>
          );
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
    const Profile = props => (
      <View key={props.key} style={gstyles.flexCenter}>
        <View style={{ width: 50, height: 50 }}>
          <CachedImage
            style={gstyles.profilePic50}
            source={{ uri: props.image }}
          />
          {props.onCancel &&
            <TouchableOpacity
              onPress={props.onCancel}
              style={{
                position: 'absolute',
                top: -5,
                right: -15,
              }}
            >
              <Icon
                name="md-close-circle"
                size={24}
                color="red"
                style={{
                  backgroundColor: 'transparent',
                }}
              />
            </TouchableOpacity>
          }
        </View>
        <Text
          style={[gstyles.font16, {
            marginTop: 5,
            alignSelf: 'center',
          }]}
        >
          {props.name}
        </Text>
      </View>
    );

    const { pickup, user } = this.props;
    const students = [];
    Object.keys(pickup.students).forEach((key) => {
      const student = pickup.students[key];

      const Escort = () => {
        if (student.escort.uid !== '') {
          const released = student.releaser.uid !== '';
          return (
            <Profile
              image={student.escort.image}
              name={student.escort.name}
              onCancel={(released || !user.admin) ? null : () => this.props.cancelEscort(pickup, user, student)}
            />
          );
        }

        if (student.releaser.uid !== '') {
          return <Text>N/A</Text>;
        }

        if (pickup.requestor.uid === user.uid && !user.admin) {
          return <Text>Waiting</Text>;
        }

        return (
          <Button
            key="escort"
            style={gstyles.flex1}
            onPress={() => this.props.escortStudent(pickup, user, student)}
            title="Escort"
          />
        );
      };

      const Release = () => {
        if (student.releaser.uid === '') {
          if (user.admin || pickup.requestor.uid === user.uid) {
            return (
              <Button
                key="release"
                style={gstyles.flex1}
                onPress={() => { this.props.releaseStudent(pickup, user, student); }}
                title="Release"
              />
            );
          }
        }
        return (
          <Profile
            image={student.releaser.image}
            name={student.releaser.name}
            onCancel={user.admin || student.releaser.uid === user.uid ? () => this.props.undoRelease(pickup, student) : null}
          />
        );
      };

      students.push((
        <View
          key={student.key}
          style={[gstyles.flexRow, gstyles.marginTop10]}
        >
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Profile
              image={student.image}
              name={`${student.name} (${student.grade.replace('_', '/')})`}
            />
          </View>
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Escort />
          </View>
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Release />
          </View>
        </View>
      ));
    });

    const messages = Object.keys(pickup.messages || {}).map((key) => {
      const message = pickup.messages[key];
      message.key = key;
      return this._renderMessage(message);
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
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Text style={gstyles.font14}>
              Student
            </Text>
          </View>
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Text style={gstyles.font14}>
              Escort
            </Text>
          </View>
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Text style={gstyles.font14}>
              Release
            </Text>
          </View>
        </View>
        {students}
        {pickup.requestor.uid !== user.uid ?
          <MapView
            style={[gstyles.flex1, gstyles.marginTop10]}
            mapType="hybrid"
            rotateEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
            cacheEnabled
            loadingEnabled
            region={{
              latitude: pickup.coordinates.latitude,
              longitude: pickup.coordinates.longitude,
              latitudeDelta: Platform.OS === 'ios' ? 0.0001 : 0.0007,
              longitudeDelta: Platform.OS === 'ios' ? 0.00005 : 0.00004,
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: pickup.coordinates.latitude,
                longitude: pickup.coordinates.longitude,
              }}
            />
          </MapView>
          :
          <View
            style={[gstyles.flex1, {
              justifyContent: 'flex-end',
              margin: 10,
            }]}
          >
            <Text>
              Keep this screen open to notify the school of your location.
            </Text>
          </View>
        }
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
  undoRelease: PropTypes.func,
};

PickupMessages.defaultProps = {
  hideRequest: false,
  cancelEscort: () => {},
  escortStudent: () => {},
  releaseStudent: () => {},
  undoRelease: () => {},
};

export default PickupMessages;
