
// @flow

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerNavigator, StackNavigator, DrawerView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import HistoryScreen from './History';
import PickupScreen from './Pickup';
import StudentsScreen from './Students';

const DrawerComponent = (props) => (
  <View style={{flex: 1}}>
    <DrawerView.Items {...props} />
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
  History: {screen: StackNavigator({History: {screen: HistoryScreen}})},
  Students: {screen: StudentsScreen},
}, {
  drawerWidth: 200,
  contentComponent: DrawerComponent,
});
