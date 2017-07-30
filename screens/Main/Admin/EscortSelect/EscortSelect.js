
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, ListView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { gstyles } from '../../../../config/styles';
import { fullName } from '../../../../helpers';
import { FBref } from '../../../../helpers/firebase';
import Button from '../../../../components/Button';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as PickupActions } from '../../../../actions/Pickup';

class EscortSelect extends React.Component {
  state: {
    pickupRequests: Object[],
    dataSource: ListView.DataSource,
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.grade,
  });

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      pickupRequests: [],
      dataSource: ds.cloneWithRows([]),
    };
  }

  _loadPickup(snapshot): Promise<any> {
    let pickupRequest = snapshot.val();
    if (pickupRequest.grades.includes(this.props.navigation.state.params.grade)) {
      pickupRequest.key = snapshot.key;
      const { students } = pickupRequest;
      return Promise.all(Object.keys(students).map((studentKey) => {
        return FBref('/students/' + studentKey).once('value').then((snapshot) => {
          return Object.assign({}, snapshot.val(), {
            key: studentKey,
            escort: students[studentKey].escort,
            released: students[studentKey].released,
          });
        });
      }))
      .then((students) => {
        pickupRequest.students = students;
        return FBref('/users/' + pickupRequest.requestor).once('value');
      })
      .then((snapshot) => {
        pickupRequest.requestor = snapshot.val();
        pickupRequest.requestor.uid = snapshot.key;
        return pickupRequest;
      });
    } else {
      return Promise.reject();
    }
  }

  componentDidMount() {
    FBref('/pickups').on('child_added', (snapshot) => {
      this._loadPickup(snapshot).then((pickupRequest) => {
        const pickupRequests = this.state.pickupRequests.concat(pickupRequest);
        this.setState({
          pickupRequests,
          dataSource: this.state.dataSource.cloneWithRows(pickupRequests),
        });
      });
    });

    FBref('/pickups').on('child_removed', (snapshot) => {
      const pickupRequests = this.state.pickupRequests.filter((request) => {
        return request.key !== snapshot.key;
      });
      this.setState({
        pickupRequests,
        dataSource: this.state.dataSource.cloneWithRows(pickupRequests),
      });
    });

    FBref('/pickups').on('child_changed', (snapshot) => {
      this._loadPickup(snapshot).then((pickupRequest) => {
        const pickupRequests = this.state.pickupRequests.map((pickup) => {
          return pickup.key == pickupRequest.key ? pickupRequest : pickup;
        });
        this.setState({
          pickupRequests,
          dataSource: this.state.dataSource.cloneWithRows(pickupRequests),
        });
      });
    });
  }

  componentWillUnmount() {
    FBref('/pickups').off();
  }

  render() {
    console.log(this.props.user);
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }

  _renderRow(pickup, sectionID, rowID) {
    let students = pickup.students.map((student, index) => {
      const escort = student.escort.uid === this.props.uid;
      let actions = [];
      if (student.released) {
        actions = [(
          <Text key='a' style={gstyles.font18}>
            released by {escort ? 'You' : student.escort.name}
          </Text>
        )];
      } else if (student.escort.uid === this.props.uid) {
        actions = [(
          <Button
            key='a'
            style={gstyles.flex1}
            onPress={this._cancelEscort.bind(this, pickup, student)}
            content='Cancel'
            backgroundColor='darkgray'
          />
        ),(
          <View key='b' style={gstyles.width10} />
        ),(
          <Button
            key='c'
            style={gstyles.flex1}
            onPress={this._release.bind(this, pickup, student)}
            content='Release'
          />
        )];
      } else if (student.escort.uid === '') {
        actions = [(
          <Button
            key='a'
            style={gstyles.flex1}
            onPress={this._escort.bind(this, pickup, student)}
            content='Escort'
          />
        )];
      } else {
        actions = [(
          <Text key='a' style={gstyles.font14}>
            escorted by {escort ? 'You' : student.escort.name}
          </Text>
        )];
      }

      return (
        <View
          key={student.key}
          style={styles.studentRequest}
        >
          <View style={styles.student}>
            <Image
              style={styles.studentImage}
              source={require('../../../../images/max.png')}
            />
            <Text style={styles.studentName}>
              {student.firstName} {student.lastInitial} ({student.grade})
            </Text>
          </View>
          <View style={styles.actionsContainer}>
            {actions}
          </View>
        </View>
      );
    });
    return (
      <View style={styles.request}>
        {students}
        <View style={styles.requestor}>
          <Image
            style={styles.requestorImage}
            source={require('../../../../images/max.png')}
          />
          <Text style={styles.requestorText}>
            {pickup.requestor.firstName} {pickup.requestor.lastInitial}
             @ front gate
          </Text>
        </View>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return <View key={`${sectionID}-${rowID}`} style={styles.separator} />
  }

  _updatePickup(pickup, student, state) {
    FBref('/pickups/' + pickup.key + '/students/' + student.key).update(state);
  }

  _escort(pickup, student) {
    this._updatePickup(pickup, student,
      {escort: {uid: this.props.uid, name: fullName(this.props.user)}}
    );
    this.props.postMessage(pickup, this.props.uid,
      `${fullName(this.props.user)} escorting ${fullName(student)}`
    );
  }

  _cancelEscort(pickup, student) {
    this._updatePickup(pickup, student,
      {escort: {uid: '', name: ''}, released: false}
    );
    this.props.postMessage(pickup, this.props.uid,
      `${fullName(this.props.user)} canceled escort of ${fullName(student)}`
    );
  }

  _release(pickup, student) {
    Alert.alert(
      'Confirm release',
      null,
      [
        {text: 'Cancel', onPress: null, style: 'cancel'},
        {text: 'OK', onPress: () => {
          this._updatePickup(pickup, student, {released: true});
          this.props.postMessage(pickup, this.props.uid,
            `${fullName(this.props.user)} released ${fullName(student)} to ${fullName(pickup.requestor)}`
          );
        }}
      ],
      {cancelable: false}
    )
  }
}


EscortSelect.propTypes = {
  uid: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  postMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EscortSelect);
