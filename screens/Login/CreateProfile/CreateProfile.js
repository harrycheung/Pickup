
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ProfileForm from '../../../components/ProfileForm';
import { Actions as UserActions } from '../../../actions/User';

class CreateProfile extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Create Profile',
    headerLeft: null,
  });

  render() {
    const { props } = this;
    return (
      <View style={styles.container}>
        <ProfileForm
          firstName={props.firstName}
          lastInitial={props.lastInitial}
          submitButtonText={'Save'}
          onSubmit={props.createUser}
        />
      </View>
    );
  }
}

CreateProfile.propTypes = {
  createUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(UserActions, dispatch),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});

export default connect(null, mapDispatchToProps)(CreateProfile);
