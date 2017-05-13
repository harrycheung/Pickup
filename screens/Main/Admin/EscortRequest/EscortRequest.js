
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import PickupMessages from '../../../../components/PickupMessages';

class EscortRequest extends React.Component {
  static navigationOptions = {
    title: 'Pickup Request',
  };

  render() {
    return (
      <PickupMessages
        uid={this.props.uid}
        pickup={this.props.navigation.state.params.pickup}
      />
    );
  }
}

EscortRequest.propTypes = {
  uid: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(EscortRequest);
