
// @flow

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import PickupScreen from './Pickup';
import HistoryScreen from './History';
import StudentsScreen from './Students';
import LogoutScreen from './Logout';

const DrawerComponent = (props) => (
  <View style={{flex: 1}}>
    <DrawerItems {...props} />
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <TouchableOpacity
        onPress={() => { props.navigation.navigate('Admin'); }}
      >
        <Text>Switch to Admin</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default DrawerNavigator({
  Pickup: {screen: PickupScreen},
  History: {screen: HistoryScreen},
  Students: {screen: StudentsScreen},
  Logout: {screen: LogoutScreen},
}, {
  drawerWidth: 200,
  order: ['Pickup', 'Students', 'History', 'Logout'],
  contentComponent: DrawerComponent,
});
