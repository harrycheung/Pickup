
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default (navigation) => ({
  left: (
    <TouchableOpacity
      onPress={() => navigation.navigate('DrawerOpen')}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginLeft: 15,
      }}
    >
      <Icon name='md-menu' size={30} color='#000000' />
    </TouchableOpacity>
  ),
});
