
import React from 'react';
import { View, Text, Button, Image, ScrollView, TouchableOpacity } from 'react-native';

import styles from './styles';
import images from '../../config/images';

class Home extends React.Component {
  static navigationOptions = {
    title: 'Synapse Pickup',
    drawer: {
      label: 'Home',
    },
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.students}>
          <View style={styles.student}>
            <Image style={styles.studentImage} source={require('../../images/max.png')} />
            <Text style={styles.studentName}>Max</Text>
          </View>
          <View style={styles.student}>
            <Image style={styles.studentImage} source={require('../../images/josh.png')} />
            <Text style={styles.studentName}>Josh</Text>
          </View>
          <View style={styles.student}>
            <Image style={styles.studentImage} source={require('../../images/sam.png')} />
            <Text style={styles.studentName}>Sam</Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.pickupButton} >
          <Text style={styles.pickupButtonText}>Pickup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Home;
