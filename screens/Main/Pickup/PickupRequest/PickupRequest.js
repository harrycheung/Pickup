
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
        postMessage={this.props.postMessage}
        onClose={() => {}}
        onComplete={() => this.props.navigateBack()}
      />
    );
  }

  componentWillUnmount() {
    this.props.cancelPickup(this.props.pickup);
  }
}

PickupRequest.propTypes = {
  uid: PropTypes.string.isRequired,
  pickup: PropTypes.object.isRequired,
  cancelPickup: PropTypes.func.isRequired,
  postMessage: PropTypes.func.isRequired,
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
