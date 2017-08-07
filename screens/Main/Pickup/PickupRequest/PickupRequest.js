
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import { gstyles } from '../../../../config/styles';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import PickupMessages from '../../../../components/PickupMessages';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as NavActions } from '../../../../actions/Navigation';

class PickupRequest extends React.Component {
  static navigationOptions = {
    title: 'Pickup Request',
  };

  componentWillMount() {
    this.props.listenPickup(this.props.pickup);
  }

  componentWillUnmount() {
    this.props.unlistenPickup();
    this.props.cancelPickup(this.props.pickup);
  }

  render() {
    return (
      <KeyboardAwareView style={gstyles.flex1}>
        <PickupMessages
          user={this.props.user}
          pickup={this.props.pickup}
          postMessage={this.props.postMessage}
          onClose={() => {}}
          onComplete={() => this.props.navigateBack()}
        />
      </KeyboardAwareView>
    );
  }
}

PickupRequest.propTypes = {
  user: PropTypes.object.isRequired,
  pickup: PropTypes.object.isRequired,
  cancelPickup: PropTypes.func.isRequired,
  postMessage: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = (dispatch) => ({
  navigateBack: () => dispatch(NavActions.back()),
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupRequest);
