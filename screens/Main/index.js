
// @flow

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import update from 'react-addons-update';

import PickupScreen from './Pickup';
import HistoryScreen from './History';
import StudentsScreen from './Students';
import LogoutScreen from './Logout';
import ProfileScreen from './Profile';
import AdminScreen from './Admin';

class Drawer extends React.Component {
  render() {
    let drawerProps = this.props;
    if (!this.props.admin) {
      drawerProps = update(this.props, {navigation: {state: {routes: {$set:
        drawerProps.navigation.state.routes.filter((route) => {
          return !route.key.includes('Admin');
        })
      }}}});
    }
    return (
      <View style={{flex: 1}}>
        <DrawerItems {...drawerProps} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  admin: state.user.admin,
});

export default DrawerNavigator({
  Pickup: {screen: PickupScreen},
  History: {screen: HistoryScreen},
  Students: {screen: StudentsScreen},
  Profile: {screen: ProfileScreen},
  Logout: {screen: LogoutScreen},
  Admin: {screen: AdminScreen},
}, {
  drawerWidth: 200,
  order: ['Pickup', 'Students', 'History', 'Profile', 'Logout', 'Admin'],
  contentComponent: connect(mapStateToProps)(Drawer),
});
