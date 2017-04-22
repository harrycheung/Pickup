
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerNavigator, StackNavigator, DrawerView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import AddStudentScreen from './AddStudent';
import AwaitingPickupScreen from './AwaitingPickup';
import HistoryScreen from './History';
import HomeScreen from './Home';

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
  Home: {screen: StackNavigator({
    Home: {screen: HomeScreen},
    AwaitingPickup: {screen: AwaitingPickupScreen},
  }, {
    initialRouteName: 'Home',
  })},
  History: {screen: StackNavigator({History: {screen: HistoryScreen}})},
  AddStudent: {screen: StackNavigator({AddStudent: {screen: AddStudentScreen}})},
}, {
  drawerWidth: 200,
  contentComponent: DrawerComponent,
});
