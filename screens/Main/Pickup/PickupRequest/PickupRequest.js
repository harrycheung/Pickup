
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import PickupMessages from '../../../../components/PickupMessages';

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
    const messages = [{
      type: 'request',
      sender: '1111111111',
      createdAt: '1',
    }, {
      type: 'message',
      sender: '1111111112',
      message: 'Is Max having a playdate with Josh?',
      createdAt: '2',
    }, {
      type: 'message',
      sender: '1111111111',
      message: 'Yes, he is',
      createdAt: '3',
    }, {
      type: 'message',
      sender: '1111111112',
      message: 'OK',
      createdAt: '4',
    }, {
      type: 'escort',
      sender: '1111111113',
      createdAt: '5',
    }, {
      type: 'release',
      sender: '1111111113',
      createdAt: '6',
    }];

    const students = this.props.navigation.state.params.students;
    const studentKeys = students.map((student) => student.key);
    const grades = Array.from(new Set(students.map((student) => student.grade)));
    let pickup = {
      requestor: this.props.uid,
      students: studentKeys,
      messages,
      grades,
      createdAt: Date.now(),
    };
    firebase.database().ref('/pickups').push(pickup)
    .then((pickupRef) => {
      pickup.key = pickupRef.key;
      pickup.students = students;
      return new Promise((resolve) => {
        //this.setState({pickup}, () => resolve(pickupRef));
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
    firebase.database().ref('/pickups/' + this.state.pickup.key).remove();
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
        />
      );
    }
  }
}

PickupRequest.propTypes = {
  uid: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupRequest);
