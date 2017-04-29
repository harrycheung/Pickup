
// @flow

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerNavigator, StackNavigator, DrawerItems } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './Home';
import EscortScreen from './Escort';

const DrawerComponent = (props) => (
  <View style={{flex: 1}}>
    <DrawerItems {...props} />
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <TouchableOpacity
        onPress={() => { props.navigation.navigate('Main'); }}
      >
        <Text>Switch to Parent</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default DrawerNavigator({
  Home: {screen: StackNavigator({
    Home: {screen: HomeScreen},
    Escort: {screen: EscortScreen},
  }, {
    initialRouteName: 'Home',
  })},
}, {
  drawerWidth: 200,
  contentComponent: DrawerComponent,
});
