
// @flow

import React from 'react';
import { Button, Text, View } from 'react-native';

import drawerHeader from '../../../helpers/DrawerHeader';
//import styles from './styles';

class History extends React.Component {
  static navigationOptions = {
    title: 'Pickup History',
    drawer: {
      label: 'History',
    },
    header: drawerHeader,
  };
  render() {
    return (
      <View>
        <Text>History</Text>
      </View>
    );
  }
}

export default History;
