
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../config/styles';
import drawerHeader from '../../../components/DrawerHeader';
import ProfileForm from '../../../components/ProfileForm';
import { Actions as UserActions } from '../../../actions/User';
import { Actions as ImageActions } from '../../../actions/Image';

class Profile extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Profile',
      drawerLabel: 'Profile',
    })
  );

  componentWillMount() {
    this.props.setImage(this.props.imageURL);
  }

  render() {
    return (
      <ProfileForm
        firstName={this.props.firstName}
        lastInitial={this.props.lastInitial}
        submitButtonText={this.props.firstName === '' ? 'Save' : 'Update'}
        onSubmit={this.props.updateUser}
        spinning={this.props.spinning}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[gstyles.flex1, { alignSelf: 'stretch' }]} />
        </TouchableWithoutFeedback>
      </ProfileForm>
    );
  }
}

Profile.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastInitial: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  spinning: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  firstName: state.user.firstName,
  lastInitial: state.user.lastInitial,
  imageURL: state.user.image,
  spinning: state.spinner,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(UserActions, dispatch),
  ...bindActionCreators(ImageActions, dispatch),
});

export default StackNavigator({
  Profile: { screen: connect(mapStateToProps, mapDispatchToProps)(Profile) },
});
