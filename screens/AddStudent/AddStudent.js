
import React from 'react';
import { Button, Image, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import { colors } from '../../config/styles';
import LinedTextInput from '../../components/LinedTextInput';
import RelationshipPicker from '../../components/RelationshipPicker';

class AddStudent extends React.Component {
  static navigationOptions = {
    title: 'Add Student',
    drawer: {
      label: 'Add Student',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      image: null,
    }
  }

  render() {
    let image = null;
    if (this.state.image == null) {
      image = (
        <TouchableOpacity
          style={styles.studentImage}
          onPress={() => {}}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name='plus' size={90} color='#ffffff' />
          </View>
        </TouchableOpacity>
      );
    } else {
      image = <Image style={styles.studentImage} source={require('../../images/josh.png')} />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          {image}
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
