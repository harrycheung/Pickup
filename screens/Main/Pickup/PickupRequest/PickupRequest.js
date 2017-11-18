
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation';

import { gstyles } from '../../../../config/styles';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import PickupMessages from '../../../../components/PickupMessages';
import MessageView from '../../../../components/MessageView';
import { Actions as PickupActions } from '../../../../actions/Pickup';

class PickupRequest extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => ({
    title: 'Pickup Request',
    headerLeft: navigation.state.params && navigation.state.params.admin ? (
      <HeaderBackButton
        onPress={() => {
          navigation.state.params.clearPickup();
          navigation.goBack(navigation.state.params && navigation.state.params.key);
        }}
        title="Back"
        tintColor={navigationOptions.headerTintColor}
      />
    ) : null,
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.cancelPickup();
          navigation.goBack(navigation.state.params && navigation.state.params.key);
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          marginHorizontal: 15,
        }}
      >
        <Text style={[gstyles.font18, { color: 'white' }]}>
          Cancel
        </Text>
      </TouchableOpacity>
    ),
  });

  componentWillMount() {
    this.props.listenPickup(this.props.pickup);
    this.props.listenLocation(this.props.pickup);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      admin: this.props.admin,
      cancelPickup: this._cancelPickup.bind(this),
      clearPickup: this.props.clearPickup,
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.pickup !== null;
  }

  componentWillUnmount() {
    this.props.unlistenPickup();
    this.props.unlistenLocation();
  }

  _cancelPickup() {
    this.componentWillUnmount();
    this.props.cancelPickup(this.props.pickup);
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <KeyboardAwareView style={gstyles.flex1}>
          <PickupMessages
            user={this.props.user}
            pickup={this.props.pickup}
            releaseStudent={this.props.releaseStudent}
            postMessage={this.props.postMessage}
          />
        </KeyboardAwareView>
      </MessageView>
    );
  }
}

PickupRequest.propTypes = {
  user: PropTypes.object.isRequired,
  admin: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  pickup: PropTypes.object,
  cancelPickup: PropTypes.func.isRequired,
  clearPickup: PropTypes.func.isRequired,
  releaseStudent: PropTypes.func.isRequired,
  postMessage: PropTypes.func.isRequired,
  listenPickup: PropTypes.func.isRequired,
  unlistenPickup: PropTypes.func.isRequired,
  listenLocation: PropTypes.func.isRequired,
  unlistenLocation: PropTypes.func.isRequired,
};

PickupRequest.defaultProps = {
  pickup: null,
};

const mapStateToProps = state => ({
  user: state.user,
  admin: state.user.admin,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupRequest);
