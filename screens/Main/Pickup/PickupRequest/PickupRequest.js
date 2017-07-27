
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import PickupMessages from '../../../../components/PickupMessages';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as NavActions } from '../../../../actions/Navigation';

class PickupRequest extends React.Component {
  static navigationOptions = {
    title: 'Pickup Request',
  };

  render() {
    return (
      <PickupMessages
        uid={this.props.uid}
        pickup={this.props.pickup}
        students={this.props.navigation.state.params.students}
        onClose={() => {}}
        onComplete={() => this.props.back()}
      />
    );
  }

  _cancel() {
    this.props.cancelPickup(this.props.pickup);
    this.props.navigateBack();
  }
}

PickupRequest.propTypes = {
  uid: PropTypes.string.isRequired,
  pickup: PropTypes.object.isRequired,
  cancelPickup: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = (dispatch) => ({
  navigateBack: () => dispatch(NavActions.back()),
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupRequest);
