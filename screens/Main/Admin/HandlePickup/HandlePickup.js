
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
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
    return {
      title: params ? params.title : '',
      headerRight: navigation.state.params && navigation.state.params.requestor ? (
        <TouchableOpacity
          onPress={() => {
            navigation.state.params.cancelPickup();
            navigation.goBack();
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
      ) : null,
    };
  };

  componentDidMount() {
    const names = Object.keys(this.props.pickup.students).map(key => (
      this.props.pickup.students[key].name
    ));
    this.props.navigation.setParams({
      title: truncate(names.join(', '), 20),
      requestor: this.props.pickup.requestor.uid === this.props.user.uid,
      cancelPickup: () => {
        this.props.unlistenPickup();
        this.props.cancelPickup(this.props.pickup);
      },
    });
  }

  componentWillUnmount() {
    // Need to unlisten to cleanup
    this.props.unlistenPickup();
    this.props.unlistenCoordinates();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.pickup !== null;
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <KeyboardAwareView style={gstyles.flex1}>
          {this.props.pickup != null &&
            <PickupMessages
              user={this.props.user}
              pickup={this.props.pickup}
              postMessage={this.props.postMessage}
              escortStudent={this.props.escortStudent}
              cancelEscort={this.props.cancelEscort}
              releaseStudent={this.props.releaseStudent}
              undoRelease={this.props.undoRelease}
              hideRequest
            />
          }
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
  unlistenPickup: PropTypes.func.isRequired,
  cancelPickup: PropTypes.func.isRequired,
  escortStudent: PropTypes.func.isRequired,
  cancelEscort: PropTypes.func.isRequired,
  undoRelease: PropTypes.func.isRequired,
  releaseStudent: PropTypes.func.isRequired,
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
