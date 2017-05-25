
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import PickupMessages from '../../../../components/PickupMessages';
import { Actions as NavActions } from '../../../../actions/Navigation';

class EscortRequest extends React.Component {
  static navigationOptions = {
    title: 'Pickup Request',
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <PickupMessages
          uid={this.props.uid}
          pickup={this.props.navigation.state.params.pickup}
          onClose={this._pickupClosed.bind(this)}
          onComplete={this._pickupCompleted.bind(this)}
        />
      </View>
    );
  }

  _pickupClosed() {
    Alert.alert(
      'Pickup request was canceled',
      null,
      [{text: 'OK', onPress: () => this.props.back()}]
    );
  }

  _pickupCompleted() {
    this.props.back();
  }
}

EscortRequest.propTypes = {
  uid: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EscortRequest);
