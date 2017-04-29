
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Exponent, {
  Constants,
  ImagePicker,
  registerRootComponent,
} from 'expo';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import * as c from '../../config/constants';
import styles from './styles';
import { colors } from '../../config/styles';
import drawerHeader from '../../helpers/DrawerHeader';
import LinedTextInput from '../LinedTextInput';
import Picker from '../Picker';
import Button from '../Button';

class StudentForm extends React.Component {
  state: {
    disabled: boolean,
    firstName: string,
    lastInitial: string,
    grade: string,
    relationship: string,
  };
  static defaultProps: {
    firstName: string,
    lastInitial: string,
    grade: string,
    relationship: string,
    submitButtonText: string,
    onSubmit: (firstName: string, lastInitial: string, grade: string, relationship: string) => void,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      disabled: true,
      firstName: this.props.firstName,
      lastInitial: this.props.lastInitial,
      grade: this.props.grade,
      relationship: this.props.relationship,
    };
  }

  componentDidMount() {
    this._validate({});
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return this.state.disabled != nextState.disabled;
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
            onChangeText={(text) => this._validate({firstName: text})}
            defaultValue={this.state.firstName}
          />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder='Last Initial'
            maxLength={1}
            autoCapitalize='words'
            clearButtonMode='while-editing'
            borderBottomColor={colors.darkGrey}
            onChangeText={(text) => this._validate({lastInitial: text})}
            defaultValue={this.state.lastInitial}
          />
          <Text style={[styles.pickerLabel, styles.marge]}>Level</Text>
          <Picker
            style={StyleSheet.flatten(styles.picker)}
            values={c.Levels}
            onChange={(value) => this._validate({grade: value})}
            value={this.state.grade}
          />
          <Text style={[styles.pickerLabel, styles.margin]}>Relationship to Student</Text>
          <Picker
            style={StyleSheet.flatten(styles.picker)}
            values={c.Relationships}
            onChange={(value) => this._validate({relationship: value})}
            value={this.state.relationship}
          />
        </View>
        <Button
          onPress={this._submit.bind(this)}
          style={styles.submitButton}
          disabled={this.state.disabled}
        >
          <Text style={styles.submitButtonText}>
            {this.props.submitButtonText}
          </Text>
        </Button>
      </View>
    );
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
      const { state, props } = this;
      const disabled = (
        state.firstName.length < 1 ||
        state.lastInitial.length < 1 ||
        state.relationship == null ||
        state.grade == null || (
          state.firstName == props.firstName &&
          state.lastInitial == props.lastInitial &&
          state.grade == props.grade &&
          state.relationship == props.relationship
        )
      );
      if (this.state.disabled != disabled) {
        this.setState({disabled});
      }
    });
  }

  _submit() {
    const { firstName, lastInitial, grade, relationship } = this.state;
    this.props.onSubmit(firstName, lastInitial, grade, relationship);
  }
}

StudentForm.propTypes = {
  firstName: PropTypes.string,
  lastInitial: PropTypes.string,
  grade: PropTypes.string,
  relationship: PropTypes.string,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func,
};

StudentForm.defaultProps = {
  firstName: '',
  lastInitial: '',
  grade: '',
  relationship: '',
  submitButtonText: 'Done',
  onSubmit: () => {},
}

export default StudentForm;
