
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ListView, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { Actions as PickupActions } from '../../../../actions/Pickup';

class PickupRequest extends React.Component {
  state: {
    dataSource: ListView.StudentSource,
  };

  static navigationOptions = {
    title: 'Pickup Request',
  };

  constructor(props) {
    super(props);

    const messages = [{
      type: 'request',
      sender: '1111111111',
    }, {
      type: 'message',
      sender: '1111111112',
      message: 'Is Max having a playdate with Josh?',
    }, {
      type: 'message',
      sender: '1111111111',
      message: 'Yes, he is',
    }, {
      type: 'message',
      sender: '11111111112',
      message: 'OK',
    }, {
      type: 'escort',
      sender: '11111111113',
    }, {
      type: 'release',
      sender: '11111111113',
    }];
    const ds = new ListView.StudentSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(messages),
    };
  }

  componentWillUnmount() {
    if (this.props.active) {
      // Must have canceled
      this.props.pickupCanceled(this.props.request.key);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }

  _renderRow(messageStudent, sectionID, rowID) {
    const rowKey = `${sectionID}-${rowID}`;
    let containerStyle = [styles.messageContainer];
    let messageStyle = [styles.message];
    let sender = null;
    let message = <Text>Unknown message</Text>

    if (messageStudent.sender === this.props.uid) {
      containerStyle.push(styles.right);
      messageStyle.push(styles.withoutSender);
    } else {
      containerStyle.push(styles.left);
      messageStyle.push(styles.withSender);
      sender = messageStudent.sender;
    }

    switch (messageStudent.type) {
      case 'request':
        message = (
          <View style={styles.request}>
            <Text style={styles.messageText}>
              Requesting pickup at the front gate for
            </Text>
            <View style={styles.student}>
              <Image
                style={styles.studentImage}
                source={require('../../../../images/max.png')}
              />
              <Text style={styles.studentName}>
                Max Cheung
              </Text>
            </View>
            <View style={styles.student}>
              <Image
                style={styles.studentImage}
                source={require('../../../../images/max.png')}
              />
              <Text style={styles.studentName}>
                Max2 Cheung
              </Text>
            </View>
            <View style={styles.student}>
              <Image
                style={styles.studentImage}
                source={require('../../../../images/max.png')}
              />
              <Text style={styles.studentName}>
                Max2 Cheung
              </Text>
            </View>
          </View>
        );
        break;

      case 'message':
        message = messageStudent.message;
        break;

      case 'escort':
        message = 'Sara H is escorting Max C and Josh B to the front gate';
        break;

      case 'release':
        message = 'Sara H released Max C and Josh B to Harry C';
        break;
    }

    return this._renderMessage(
      rowKey, containerStyle, sender, messageStyle, message
    );
  }

  _renderMessage(rowKey, containerStyle, sender, messageStyle, message) {
    let senderJSX = null;
    if (sender !== null) {
      senderJSX = (
        <Image
          style={styles.senderImage}
          source={require('../../../../images/max.png')}
        />
      );
    }

    if (typeof message === 'string') {
      message = <Text style={styles.messageText}>{message}</Text>
    }

    return (
      <View key={rowKey} style={containerStyle}>
        {senderJSX}
        <View style={messageStyle}>
          {message}
        </View>
      </View>
    );
  }
}

PickupRequest.propTypes = {
  request: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
  pickupCanceled: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  request: state.pickup.request,
  active: state.pickup.active,
  uid: state.auth.user.uid,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupRequest);
