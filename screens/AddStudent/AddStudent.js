
import React from 'react';
import { Button, Image, Text, View, TouchableOpacity } from 'react-native';

import styles from './styles';
import { colors } from '../../config/styles';
import images from '../../config/images';
import LinedTextInput from '../../components/LinedTextInput';
import RelationshipPicker from '../../components/RelationshipPicker';

class AddStudent extends React.Component {
  static navigationOptions = {
    title: 'Add Student',
    drawer: {
      label: 'Add Student',
    },
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Image style={styles.studentImage} source={require('../../images/josh.png')} />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder='First Name'
            autoCapitalize='words'
            clearButtonMode='while-editing'
            borderBottomColor={colors.darkGrey}
          />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder='Last Initial'
            maxLength={1}
            autoCapitalize='words'
            clearButtonMode='while-editing'
            borderBottomColor={colors.darkGrey}
          />
          <Text style={[styles.relationshipLabel, styles.margin]}>Relationship to Student</Text>
          <RelationshipPicker
            style={styles.relationshipPicker}
            values={['Parent', 'Family', 'Nanny']}
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default AddStudent;
