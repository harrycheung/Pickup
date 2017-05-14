
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import Exponent, { ImagePicker } from 'expo';
import firebase from 'firebase';
// import RNFS from 'react-native-fs';

import * as c from '../../config/constants';
import styles from './styles';
import { colors } from '../../config/styles';
import drawerHeader from '../../components/DrawerHeader';
import LinedTextInput from '../LinedTextInput';
import Picker from '../Picker';
import CustomButton from '../Button';

class ProfileForm extends React.Component {
  state: {
    disabled: boolean,
    firstName: string,
    lastInitial: string,
    image: string,
  };

  static defaultProps: {
    firstName: string,
    lastInitial: string,
    submitButtonText: string,
    isDisabled: () => Object,
    onSubmit: (firstName: string, lastInitial: string) => void,
    spinning: boolean,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      disabled: true,
      firstName: this.props.firstName,
      lastInitial: this.props.lastInitial,
      image: null,
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    this.setState({disabled: nextProps.spinning});
  }

  render() {
    const { image } = this.state;
    let imageJSX = null;
    if (image === null) {
      imageJSX = (
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
      imageJSX = <Image style={styles.studentImage} source={{uri: image}} />;
    }

    let buttonContents = null;
    if (this.props.spinning) {
      buttonContents = (
        <ActivityIndicator
          animating={true}
          color='white'
          size='small'
        />
      );
    } else {
      buttonContents = (
        <Text style={styles.submitButtonText}>
          {this.props.submitButtonText}
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          {imageJSX}
          <Button
            title="Change photo"
            onPress={this._takePhoto.bind(this)}
          />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder='First Name'
            autoCapitalize='words'
            clearButtonMode='while-editing'
            borderBottomColor={colors.darkGrey}
            onChangeText={(text) => this._updateState({firstName: text})}
            defaultValue={this.state.firstName}
          />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder='Last Initial'
            maxLength={1}
            autoCapitalize='words'
            clearButtonMode='while-editing'
            borderBottomColor={colors.darkGrey}
            onChangeText={(text) => this._updateState({lastInitial: text})}
            defaultValue={this.state.lastInitial}
          />
          {this.props.children}
        </View>
        <CustomButton
          onPress={this._submit.bind(this)}
          style={styles.submitButton}
          disabled={this.state.disabled}
        >
          {buttonContents}
        </CustomButton>
      </View>
    );
  }

  async _takePhoto() {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1,1]
    });

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    const photoRef = firebase.storage().ref().child('images/' + guid());
    this.setState({image: pickerResult.uri});
  }

  updateDisabled() {
    const { state, props } = this;
    const { invalid, same } = props.isDisabled();
    const disabled = (
      state.firstName.length < 1 ||
      state.lastInitial.length < 1 ||
      invalid || (
        state.firstName === props.firstName &&
        state.lastInitial === props.lastInitial &&
        same
      )
    );
    if (this.state.disabled !== disabled) {
      this.setState({disabled});
    }
  }

  _updateState(newState) {
    this.setState(newState, () => {
      this.updateDisabled();
    });
  }

  _submit() {
    const { firstName, lastInitial } = this.state;
    this.props.onSubmit(firstName, lastInitial);
  }
}

ProfileForm.propTypes = {
  firstName: PropTypes.string,
  lastInitial: PropTypes.string,
  isDisabled: PropTypes.func,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func,
  spinning: PropTypes.bool,
};

ProfileForm.defaultProps = {
  firstName: '',
  lastInitial: '',
  isDisabled: () => ({invalid: false, same: true}),
  submitButtonText: 'Done',
  onSubmit: () => {},
  spinning: false,
}

export default ProfileForm;
