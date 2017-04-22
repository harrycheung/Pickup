
import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import EscortScreen from './Escort';
import EscortLevelScreen from './EscortLevel';

export default DrawerNavigator({
  Escort: {screen: StackNavigator({
    Escort: {screen: EscortScreen},
    EscortLevel: {screen: EscortLevelScreen},
  }, {
    initialRouteName: 'Escort',
  })},
}, {
  drawerWidth: 200,
});
