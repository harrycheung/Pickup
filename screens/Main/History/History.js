
// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import drawerHeader from '../../../components/DrawerHeader';

class History extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Pickup History',
      drawerLabel: 'History',
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

export default StackNavigator({
  Logout: {
    screen: History,
  },
});
