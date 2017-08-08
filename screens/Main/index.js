
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { gstyles } from '../../config/styles';
import PickupScreen from './Pickup';
import StudentsScreen from './Students';
import LogoutScreen from './Logout';
import ProfileScreen from './Profile';
import AdminScreen from './Admin';

class Drawer extends React.Component {
  render() {
    let drawerProps = this.props;
    if (!this.props.admin) {
      drawerProps = update(this.props, { items: { $set:
        drawerProps.items.filter(route => !route.key.includes('Admin')),
      } });
    }
    return (
      <View style={gstyles.flex1}>
        <DrawerItems {...drawerProps} />
      </View>
    );
  }
}

Drawer.propTypes = {
  admin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  admin: state.user.admin,
});

export default DrawerNavigator({
  Pickup: { screen: PickupScreen },
  Students: { screen: StudentsScreen },
  Profile: { screen: ProfileScreen },
  Logout: { screen: LogoutScreen },
  Admin: { screen: AdminScreen },
}, {
  drawerWidth: 200,
  order: ['Pickup', 'Students', 'Profile', 'Logout', 'Admin'],
  contentComponent: connect(mapStateToProps)(Drawer),
});
