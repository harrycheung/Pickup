
// @flow

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { merge } from '../helpers';

export default (navigation: NavigationActions, screenProps: Object, options: Object) => (
  merge(options, {
    headerLeft: (
      <TouchableOpacity
        onPress={() => navigation.navigate('DrawerOpen')}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          marginLeft: 15,
        }}
      >
        <Icon name="md-menu" size={30} color="#000000" />
      </TouchableOpacity>
    ),
  })
);
