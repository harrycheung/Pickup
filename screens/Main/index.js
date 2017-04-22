
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import AddStudentScreen from './AddStudent';
import AwaitingPickupScreen from './AwaitingPickup';
import HistoryScreen from './History';
import HomeScreen from './Home';
import EscortScreen from './Escort';
import EscortLevelScreen from './EscortLevel';

const StackScreen = (rootScreen, otherScreens) => {
  return StackNavigator({
    root: {
      screen: rootScreen,
      navigationOptions: {
        header: (navigation) => ({
          left: (
            <TouchableOpacity
              onPress={() => navigation.navigate('DrawerOpen')}
              style={styles.menuButton}
            >
              <Icon name='md-menu' size={30} color='#000000' />
            </TouchableOpacity>
          ),
        }),
      },
    },
    ...otherScreens
  });
};

var styles = StyleSheet.create({
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 15,
  },
});

const Main = DrawerNavigator({
  Home: {screen: StackScreen(HomeScreen, {AwaitingPickup: {screen: AwaitingPickupScreen}})},
  History: {screen: StackScreen(HistoryScreen)},
  AddStudent: {screen: StackScreen(AddStudentScreen)},
  Escort: {screen: StackScreen(EscortScreen, {EscortLevel: {screen: EscortLevelScreen}})},
}, {
  drawerWidth: 200,
});

export default Main;
