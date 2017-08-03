
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import drawerHeader from '../../../components/DrawerHeader';
import { Actions as AuthActions } from '../../../actions/Auth';

class Logout extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Logout',
      drawerLabel: 'Logout',
    })
  );

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Logout</Text>
      </View>
    );
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Logout);
