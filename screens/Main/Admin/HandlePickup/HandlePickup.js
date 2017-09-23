
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../../config/styles';
import { truncate } from '../../../../helpers';
import PickupMessages from '../../../../components/PickupMessages';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import MessageView from '../../../../components/MessageView';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as AdminActions } from '../../../../actions/Admin';

class HandlePickup extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return { title: params ? params.title : '' };
  };

  componentWillMount() {
    this.props.listenPickup(this.props.pickup);
    this.props.listenCoordinates(this.props.pickup);
  }

  componentDidMount() {
    const names = [];
    Object.keys(this.props.pickup.students).forEach((key) => {
      names.push(this.props.pickup.students[key].name);
    });
    this.props.navigation.setParams({ title: truncate(names.join(', '), 20) });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.pickup !== null;
  }

  componentWillUnmount() {
    this.props.unlistenPickup();
    this.props.unlistenCoordinates();
    this.props.clearPickup();
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <KeyboardAwareView style={gstyles.flex1}>
          <PickupMessages
            user={this.props.user}
            pickup={this.props.pickup}
            postMessage={this.props.postMessage}
            escortStudent={this.props.escortStudent}
            cancelEscort={this.props.cancelEscort}
            releaseStudent={this.props.releaseStudent}
            hideRequest
          />
        </KeyboardAwareView>
      </MessageView>
    );
  }
}


HandlePickup.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  pickup: PropTypes.object,
  postMessage: PropTypes.func.isRequired,
  listenPickup: PropTypes.func.isRequired,
  unlistenPickup: PropTypes.func.isRequired,
  clearPickup: PropTypes.func.isRequired,
  escortStudent: PropTypes.func.isRequired,
  cancelEscort: PropTypes.func.isRequired,
  releaseStudent: PropTypes.func.isRequired,
  listenCoordinates: PropTypes.func.isRequired,
  unlistenCoordinates: PropTypes.func.isRequired,
};

HandlePickup.defaultProps = {
  pickup: null,
};

const mapStateToProps = state => ({
  user: state.user,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(AdminActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HandlePickup);
