
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
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

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      pickupRequests: [],
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    let pickupRequest = {}
    firebase.database().ref('/pickups').on('child_added', (snapshot) => {
      pickupRequest = snapshot.val();
      if (pickupRequest.grades.includes(this.props.navigation.state.params.grade)) {
        pickupRequest.key = snapshot.key;
        Promise.all(pickupRequest.students.map((studentKey) => {
          return firebase.database().ref('/students/' + studentKey).once('value')
          .then((snapshot) => {
            return Object.assign({}, snapshot.val(), {key: studentKey});
          });
        }))
        .then((students) => {
          pickupRequest.students = students;
          return firebase.database().ref('/users/' + pickupRequest.requestor).once('value');
        })
        .then((snapshot) => {
          const uid = pickupRequest.requestor;
          pickupRequest.requestor = snapshot.val();
          pickupRequest.requestor.uid = uid;
          const pickupRequests = this.state.pickupRequests.concat(pickupRequest);
          this.setState({
            pickupRequests,
            dataSource: this.state.dataSource.cloneWithRows(pickupRequests),
          });
        });
      }
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
    let students = pickup.students.map((student) => {
      return (
        <Image
          key={student.key}
          style={styles.studentImage}
          source={require('../../../../images/max.png')}
        />
      );
    });
    return (
      <TouchableOpacity
        key={`${sectionID}-${rowID}`}
        style={styles.row}
        onPress={() => this.props.navigate('EscortRequest', {pickup})}
      >
        <Image
          style={styles.requestorImage}
          source={require('../../../../images/max.png')}
        />
        <Text style={styles.requestorName}>
          {pickup.requestor.firstName} {pickup.requestor.lastInitial}
        </Text>
        {students}
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return <View key={`${sectionID}-${rowID}`} style={styles.separator} />
  }
}


EscortSelect.propTypes = {
  navigate: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EscortSelect);
