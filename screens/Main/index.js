
import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import AddStudentScreen from './AddStudent';
import AwaitingPickupScreen from './AwaitingPickup';
import HistoryScreen from './History';
import HomeScreen from './Home';

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
});
