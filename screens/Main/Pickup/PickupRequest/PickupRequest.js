
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import PickupMessages from '../../../../components/PickupMessages';
import { Actions as NavActions } from '../../../../actions/Navigation';

class PickupRequest extends React.Component {
  state: {
    pickup: Object,
  };

  static navigationOptions = {
    title: 'Pickup Request',
  };

  constructor(props) {
    super(props);

    this.state = {
      pickup: null,
    };
  }

  componentDidMount() {
    const students = this.props.navigation.state.params.students;
    const pickupStudents = students.reduce((students, student) => {
      students[student.key] = {escort: ''};
      return students;
    }, {});
    const grades = Array.from(new Set(students.map((student) => student.grade)));
    let pickup = {
      requestor: this.props.uid,
      students: pickupStudents,
      grades,
      createdAt: Date.now(),
    };
    firebase.database().ref('/pickups').push(pickup)
    .then((pickupRef) => {
      pickup.key = pickupRef.key;
      pickup.students = students;
      return new Promise((resolve) => {
        this.setState({pickup}, () => resolve(pickupRef));
      });
    })
    .then((pickupRef) => {
      return pickupRef.child('messages').push({
        type: 'request',
        sender: this.props.uid,
        createdAt: Date.now(),
      })
      .then((messageRef) => {
        return pickupRef;
      });
    })
    .then((pickupRef) => {
      pickupRef.child('completedAt').on('value', (snapshot) => {
        if (snapshot.val() !== null) {
          console.log('completed', snapshot.val());
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.state.pickup !== null) {
      firebase.database().ref('/pickups/' + this.state.pickup.key).remove();
    }
  }

  render() {
    if (this.state.pickup === null) {
      return (
        <ActivityIndicator
          style={{flex: 1}}
          animating={true}
          color='black'
          size='large'
        />
      );
    } else {
      return (
        <PickupMessages
          uid={this.props.uid}
          pickup={this.state.pickup}
          onClose={() => {}}
          onComplete={() => this.props.back()}
        />
      );
    }
  }
}

PickupRequest.propTypes = {
  uid: PropTypes.string.isRequired,
  back: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupRequest);
