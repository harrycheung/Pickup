
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../config/styles';
import ProfileForm from '../../../components/ProfileForm';
import { Actions as UserActions } from '../../../actions/User';

class CreateProfile extends React.Component {
  static navigationOptions = () => ({
    title: 'Create Profile',
    headerLeft: null,
  });

  render() {
    return (
      <View style={gstyles.flex1}>
        <ProfileForm
          firstName={this.props.firstName}
          lastInitial={this.props.lastInitial}
          submitButtonText={'Save'}
          onSubmit={this.props.createUser}
        />
      </View>
    );
  }
}

CreateProfile.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastInitial: PropTypes.string.isRequired,
  createUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(UserActions, dispatch),
});

export default connect(null, mapDispatchToProps)(CreateProfile);
