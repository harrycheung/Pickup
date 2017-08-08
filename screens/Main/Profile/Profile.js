
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../config/styles';
import drawerHeader from '../../../components/DrawerHeader';
import ProfileForm from '../../../components/ProfileForm';
import { Actions as UserActions } from '../../../actions/User';

class Profile extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Profile',
      drawerLabel: 'Profile',
    })
  );

  render() {
    return (
      <View style={gstyles.flex1}>
        <ProfileForm
          firstName={this.props.firstName}
          lastInitial={this.props.lastInitial}
          submitButtonText={this.props.firstName === '' ? 'Save' : 'Update'}
          onSubmit={this.props.updateUser}
          spinning={this.props.spinning}
        />
      </View>
    );
  }
}

Profile.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastInitial: PropTypes.string.isRequired,
  spinning: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  firstName: state.user.firstName,
  lastInitial: state.user.lastInitial,
  spinning: state.spinner,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(UserActions, dispatch),
});

export default StackNavigator({
  Profile: { screen: connect(mapStateToProps, mapDispatchToProps)(Profile) },
});
