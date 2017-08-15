
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ProfileForm from '../../../components/ProfileForm';
import { Actions as UserActions } from '../../../actions/User';
import { Actions as AuthActions } from '../../../actions/Auth';
import { Actions as ImageActions } from '../../../actions/Image';

class CreateProfile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let headerRight = null;
    if (navigation.state.params) {
      headerRight = <Button title="Cancel" onPress={navigation.state.params.logout} />;
    }

    return {
      title: 'Create Profile',
      headerLeft: null,
      headerRight,
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({ logout: this.props.logout });
    this.props.clearImage();
  }

  render() {
    return (
      <ProfileForm
        submitButtonText="Create"
        onSubmit={this.props.createUser}
        usePadding
      />
    );
  }
}

CreateProfile.propTypes = {
  navigation: PropTypes.object.isRequired,
  createUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  clearImage: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(UserActions, dispatch),
  ...bindActionCreators(AuthActions, dispatch),
  ...bindActionCreators(ImageActions, dispatch),
});

export default connect(null, mapDispatchToProps)(CreateProfile);
