
// @flow

import React from 'react';
import { PixelRatio } from 'react-native';
import PropTypes from 'prop-types';
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import { gstyles } from '../../../../config/styles';
import Button from '../../../../components/Button';
import { Actions as NavActions } from '../../../../actions/Navigation';

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
        return firebase.database().ref('/students/' + studentKey).once('value')
        .then((snapshot) => {
          return Object.assign({}, snapshot.val(), {
            key: studentKey,
            escort: students[studentKey].escort,
          });
        });
      }))
      .then((students) => {
        pickupRequest.students = students;
        return firebase.database().ref('/users/' + pickupRequest.requestor).once('value');
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
    firebase.database().ref('/pickups').on('child_added', (snapshot) => {
      this._loadPickup(snapshot).then((pickupRequest) => {
        const pickupRequests = this.state.pickupRequests.concat(pickupRequest);
        this.setState({
          pickupRequests,
          dataSource: this.state.dataSource.cloneWithRows(pickupRequests),
        });
      });
    });

    firebase.database().ref('/pickups').on('child_removed', (snapshot) => {
      const pickupRequests = this.state.pickupRequests.filter((request) => {
        return request.key !== snapshot.key;
      });
      this.setState({
        pickupRequests,
        dataSource: this.state.dataSource.cloneWithRows(pickupRequests),
      });
    });

    firebase.database().ref('/pickups').on('child_changed', (snapshot) => {
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
    firebase.database().ref('/pickups').off();
  }

  render() {
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
      let actions = '';
      if (student.released) {
        actions = (
          <View style={styles.actionsContainer}>
            <Text style={styles.releaseText}>
              released by someone
            </Text>
          </View>
        );
      } else if (student.escort === this.props.uid) {
        actions = (
          <View style={styles.actionsContainer}>
            <Button
              style={gstyles.flex1}
              onPress={this._escort.bind(this, rowID, index, '')}
              content='Cancel'
              backgroundColor='darkgray'
            />
            <View style={gstyles.width10} />
            <Button
              style={gstyles.flex1}
              onPress={this._release.bind(this, rowID, index)}
              content='Release'
            />
          </View>
        );
      } else if (student.escort === '') {
        actions = (
          <View style={styles.actionsContainer}>
            <Button
              style={gstyles.flex1}
              onPress={this._escort.bind(this, rowID, index, this.props.uid)}
              content='Escort'
            />
          </View>
        );
      } else {
        actions = (
          <View style={styles.actionsContainer}>
            <Text style={styles.releaseText}>
              escorting by someone
            </Text>
          </View>
        );
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
          {actions}
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

  _updatePickup(pickupIndex, studentIndex, state) {
    const { pickupRequests } = this.state;
    let pickup = Object.assign({}, pickupRequests[pickupIndex]);
    let student = pickup.students[studentIndex];
    firebase.database().ref('/pickups/' + pickup.key + '/students/' + student.key)
    .update(state);
  }

  _escort(pickupIndex, studentIndex, escort) {
    this._updatePickup(pickupIndex, studentIndex, {escort});
  }

  _release(pickupIndex, studentIndex) {
    this._updatePickup(pickupIndex, studentIndex, {released: true});
  }
}


EscortSelect.propTypes = {
  uid: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
  state: state,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EscortSelect);
