
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
    dataSource: ListView.DataSource,
  };

  static navigationOptions = {
    title: 'Pickup Request',
  };

  constructor(props) {
    super(props);

    const messages = [{
      type: 'request',
    }, {
      type: 'message',
      sender: '1111111112',
      message: 'Is Max having a playdate with Josh?',
    }, {
      type: 'message',
      sender: '1111111111',
      message: 'Yes, he is',
    }];
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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

  _renderRow(message, sectionID, rowID) {
    const rowKey = `${sectionID}-${rowID}`;

    switch (message.type) {
      case 'request': {
        return (
          <View key={rowKey} style={[styles.messageContainer, styles.right]}>
            <View style={[styles.message, styles.withoutSender]}>
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
          </View>
        );
      }

      case 'message': {
        let containerStyle = [styles.messageContainer];
        let messageStyle = [styles.message];
        let senderJSX = null;
        if (message.sender === this.props.uid) {
          containerStyle.push(styles.right);
          messageStyle.push(styles.withoutSender);
        } else {
          containerStyle.push(styles.left);
          messageStyle.push(styles.withSender);
          senderJSX = (
            <Image
              style={styles.senderImage}
              source={require('../../../../images/max.png')}
            />
          );
        }
        return (
          <View key={rowKey} style={containerStyle}>
            {senderJSX}
            <View style={messageStyle}>
              <Text style={styles.messageText}>
                {message.message}
              </Text>
            </View>
          </View>
        );
      }

      default:
        return <View><Text>Unknown message</Text></View>
    }
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
