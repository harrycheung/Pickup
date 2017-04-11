
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import CustomStackNavigator from './components/CustomStackNavigator';
import AddStudentScreen from './screens/AddStudent';
import HomeScreen from './screens/Home';
import HistoryScreen from './screens/History';
import LaunchScreen from './screens/Launch';
import LoginScreen from './screens/Login';

const StackScreen = (Screen) => {
  return StackNavigator({
    root: {
      screen: Screen,
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
    }
  });
};

const MainNavigator = DrawerNavigator({
  Home: { screen: StackScreen(HomeScreen) },
  History: { screen: StackScreen(HistoryScreen) },
  AddStudent: { screen: StackScreen(AddStudentScreen) },
}, {
  drawerWidth: 200,
});

const App = StackNavigator({
  Launch: { screen: LaunchScreen },
  Login: { screen: LoginScreen },
  Main: { screen: MainNavigator },
}, {
  headerMode: 'screen',
  navigationOptions: {
    header: { visible: false }
  }
});

var styles = StyleSheet.create({
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 15,
  },
});

export default App;
