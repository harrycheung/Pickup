
// @flow

import React from 'react';
import { Button, Text, View } from 'react-native';

import drawerHeader from '../../../components/DrawerHeader';
//import styles from './styles';

class History extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Pickup History',
      drawer: {
        label: 'History',
      },
    })
  );

  render() {
    return (
      <View>
        <Text>History</Text>
      </View>
    );
  }
}

export default History;
