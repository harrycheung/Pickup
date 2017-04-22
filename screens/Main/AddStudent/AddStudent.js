
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Exponent, {
  Constants,
  ImagePicker,
  registerRootComponent,
} from 'expo';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import styles from './styles';
import { colors } from '../../../config/styles';
import drawerHeader from '../../../helpers/DrawerHeader';
import LinedTextInput from '../../../components/LinedTextInput';
import RelationshipPicker from '../../../components/RelationshipPicker';
import Button from '../../../components/Button';
import { actions as DataActions } from '../../../actions/data';

class AddStudent extends React.Component {
  static navigationOptions = {
    title: 'Add Student',
    drawer: {
      label: 'Add Student',
    },
    header: drawerHeader,
  };

  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      image: null,
      firstName: '',
      lastInitial: '',
      relationship: null,
    }
  }

  render() {
    let image = null;
    if (this.state.image == null) {
      image = (
        <TouchableOpacity
          style={styles.studentImage}
          onPress={this._takePhoto}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name='plus' size={90} color='#ffffff' />
          </View>
        </TouchableOpacity>
      );
    } else {
      image = <Image style={styles.studentImage} source={require('../../../images/josh.png')} />;
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
            onChangeText={(text) => this._validate({firstName: text})}
          />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder='Last Initial'
            maxLength={1}
            autoCapitalize='words'
            clearButtonMode='while-editing'
            borderBottomColor={colors.darkGrey}
            onChangeText={(text) => this._validate({lastInitial: text})}
          />
          <Text style={[styles.relationshipLabel, styles.margin]}>Relationship to Student</Text>
          <RelationshipPicker
            style={styles.relationshipPicker}
            values={['Parent', 'Family', 'Nanny']}
            onChange={(value) => this._validate({relationship: value})}
          />
        </View>
        <Button
          onPress={this._add.bind(this)}
          style={styles.addButton}
          disabled={this.state.disabled}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Button>
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.disabled != nextState.disabled;
  }

  async _takePhoto() {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4,3]
    });

    // this._handleImagePicked(pickerResult);
  }

  _validate(newState) {
    this.setState(newState, () => {
      const disabled = this.state.firstName.length < 1 ||
        this.state.lastInitial.length < 1 ||
        this.state.relationship == null;
      if (this.state.disabled != disabled) {
        this.setState({disabled});
      }
    });
  }

  _add() {
    const { firstName, lastInitial, relationship } = this.state;
    this.props.addStudent(firstName, lastInitial, relationship);
  }
}

AddStudent.PropTypes = {
  addStudent: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(DataActions, dispatch),
});

export default connect(null, mapDispatchToProps)(AddStudent);
