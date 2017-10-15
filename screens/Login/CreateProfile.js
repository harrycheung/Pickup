
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../config/styles';
import ProfileForm from '../../components/ProfileForm';
import MessageView from '../../components/MessageView';
import { Actions as UserActions } from '../../actions/User';

class CreateProfile extends React.Component {
  static navigationOptions = () => ({
    title: 'Create Profile',
  });

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <ProfileForm
          submitButtonText="Create"
          onSubmit={this.props.createUser}
          usePadding
          user
        >
          <Text style={{ marginTop: 40 }}>
            Note: A photo is required to verify identity.
          </Text>
        </ProfileForm>
      </MessageView>
    );
  }
}

CreateProfile.propTypes = {
  createUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(UserActions, dispatch),
});

export default connect(null, mapDispatchToProps)(CreateProfile);
