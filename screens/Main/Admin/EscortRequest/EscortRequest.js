
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import firebase from 'firebase';

import styles from './styles';
import PickupMessages from '../../../../components/PickupMessages';
import Modal from '../../../../components/Modal';
import { Actions as NavActions } from '../../../../actions/Navigation';

class EscortRequest extends React.Component {
  state: {
    modalVisible: boolean,
  };

  static navigationOptions = {
    title: 'Pickup Request',
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <PickupMessages
          uid={this.props.uid}
          pickup={this.props.navigation.state.params.pickup}
          onClose={() => this.setState({modalVisible: true})}
        />
        <Modal
          visible={this.state.modalVisible}
          animationType='fade'
          message='Pickup request was cancelled.'
          onPressOK={() => {
            this.setState({modalVisible: false}, () => {
              this.props.back();
            });
          }}
        />
      </View>
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
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EscortRequest);
