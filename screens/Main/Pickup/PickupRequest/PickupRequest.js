
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../../config/styles';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import PickupMessages from '../../../../components/PickupMessages';
import { Actions as PickupActions } from '../../../../actions/Pickup';

class PickupRequest extends React.Component {
  static navigationOptions = {
    title: 'Pickup Request',
  };

  componentWillMount() {
    this.props.listenPickup(this.props.pickup);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.pickup !== null;
  }

  componentWillUnmount() {
    this.props.unlistenPickup();

    // Cleaning up the pickup. If the requestor initiates the 'Cancel', we need
    // to cancel the pickup ourselves. If the escorter releases the last student,
    // then the saga listener will cancel the pickup and it won't be in redux
    // anymore.
    if (this.props.pickup) {
      this.props.cancelPickup(this.props.pickup);
    }
  }

  render() {
    return (
      <KeyboardAwareView style={gstyles.flex1}>
        <PickupMessages
          user={this.props.user}
          pickup={this.props.pickup}
          postMessage={this.props.postMessage}
        />
      </KeyboardAwareView>
    );
  }
}

PickupRequest.propTypes = {
  user: PropTypes.object.isRequired,
  pickup: PropTypes.object,
  cancelPickup: PropTypes.func.isRequired,
  postMessage: PropTypes.func.isRequired,
  listenPickup: PropTypes.func.isRequired,
  unlistenPickup: PropTypes.func.isRequired,
};

PickupRequest.defaultProps = {
  pickup: null,
};

const mapStateToProps = state => ({
  user: state.user,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupRequest);
