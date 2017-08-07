
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { gstyles } from '../../../../config/styles';
import { truncate } from '../../../../helpers';
import { FBref } from '../../../../helpers/firebase';
import Button from '../../../../components/Button';
import PickupMessages from '../../../../components/PickupMessages';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as PickupActions } from '../../../../actions/Pickup';

class HandlePickup extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params } = navigation.state;
    return { title: params ? params.title : '' };
  };

  componentWillMount() {
    this.props.listenPickup(this.props.pickup);
  }

  componentDidMount() {
    let names = [];
    for (let studentKey in this.props.pickup.students) {
      const student = this.props.pickup.students[studentKey];
      names.push(student.name);
    }
    this.props.navigation.setParams({ title: truncate(names.join(', '), 20) });
  }

  componentWillUnmount() {
    this.props.unlistenPickup();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.pickup !== null;
  }

  render() {
    let students = [];
    for (let studentKey in this.props.pickup.students) {
      const student = this.props.pickup.students[studentKey];
      const escort = student.escort.uid === this.props.user.uid;
      let actions = [];
      if (student.released) {
        actions = [(
          <Text key='released' style={gstyles.font18}>
            released by {escort ? 'You' : student.escort.name}
          </Text>
        )];
      } else if (escort) {
        actions = [(
          <Button
            key='cancel'
            style={gstyles.flex1}
            onPress={this._cancelEscort.bind(this, this.props.pickup, student)}
            content='Cancel'
            backgroundColor='darkgray'
          />
        ),(
          <View key='spacer' style={gstyles.width10} />
        ),(
          <Button
            key='release'
            style={gstyles.flex1}
            onPress={this._release.bind(this, this.props.pickup, student)}
            content='Release'
          />
        )];
      } else if (student.escort.uid === '') {
        actions = [(
          <Button
            key='escort'
            style={gstyles.flex1}
            onPress={this._escort.bind(this, this.props.pickup, student)}
            content='Escort'
          />
        )];
      } else {
        actions = [(
          <Text key='escort' style={gstyles.font14}>
            escorted by {student.escort.name}
          </Text>
        )];
      }

      students.push((
        <View
          key={student.key}
          style={styles.studentRequest}
        >
          <View style={styles.student}>
            <Image
              style={[gstyles.profilePic80, { marginLeft: 5 }]}
              source={require('../../../../images/max.png')}
            />
            <Text style={gstyles.font18}>
              {student.name} ({student.grade})
            </Text>
          </View>
          <View style={styles.actionsContainer}>
            {actions}
          </View>
        </View>
      ));
    }

    return (
      <KeyboardAwareView style={styles.container}>
        <View style={styles.request}>
          {students}
          <View style={styles.requestor}>
            <Image
              style={styles.requestorImage}
              source={require('../../../../images/max.png')}
            />
            <Text style={styles.requestorText}>
              {this.props.pickup.requestor.name} @ front gate
            </Text>
          </View>
        </View>
        <View style={styles.separator}>
          <Text style={styles.text}>messages</Text>
        </View>
        <PickupMessages
          user={this.props.user}
          pickup={this.props.pickup}
          postMessage={this.props.postMessage}
          onClose={() => {}}
          onComplete={() => this.props.navigateBack()}
          hideRequest={true}
        />
      </KeyboardAwareView>
    );
  }

  _updatePickup(pickup, student, state) {
    FBref('/pickups/' + pickup.key + '/students/' + student.key).update(state);
  }

  _postMessage(pickup, type, student) {
    this.props.postMessage(
      pickup,
      { uid: this.props.user.uid, name: this.props.user.name },
      { type, student: { key: student.key, name: student.name } }
    );
  }

  _escort(pickup, student) {
    this._updatePickup(pickup, student,
      { escort: { uid: this.props.user.uid, name: this.props.user.name } }
    );
    this._postMessage(pickup, 'escort', student);
  }

  _cancelEscort(pickup, student) {
    this._updatePickup(pickup, student,
      { escort: { uid: '', name: '' }, released: false }
    );
    this._postMessage(pickup, 'cancel', student);
  }

  _release(pickup, student) {
    Alert.alert(
      'Confirm release',
      null,
      [
        { text: 'Cancel', onPress: null, style: 'cancel' },
        { text: 'OK',
          onPress: () => {
            this._updatePickup(pickup, student, { released: true });
            this._postMessage(pickup, 'release', student);
          }
        }
      ],
      { cancelable: false }
    )
  }
}


HandlePickup.propTypes = {
  user: PropTypes.object.isRequired,
  pickup: PropTypes.object,
  postMessage: PropTypes.func.isRequired,
  listenPickup: PropTypes.func.isRequired,
  unlistenPickup: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.user,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HandlePickup);
