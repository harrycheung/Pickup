
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Button, Image, Keyboard, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ImagePicker } from 'expo';
import firebase from 'firebase';
// import RNFS from 'react-native-fs';

import styles from './styles';
import { colors, gstyles } from '../../config/styles';
import LinedTextInput from '../LinedTextInput';
import CustomButton from '../Button';

class ProfileForm extends React.Component {
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

    this._takePhoto = this._takePhoto.bind(this);
    this._submit = this._submit.bind(this);
    this._updateState = this._updateState.bind(this);
  }

  state: {
    disabled: boolean,
    firstName: string,
    lastInitial: string,
    image: string,
  };

  componentWillReceiveProps(nextProps: Object) {
    this.setState({ disabled: nextProps.spinning });
  }

  async _takePhoto() {
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    }

    const photoRef = firebase.storage().ref().child(`images/${guid()}`);
    this.setState({ image: pickerResult.uri });
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
      this.setState({ disabled });
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

  render() {
    const { image } = this.state;
    let imageJSX = null;
    if (image === null) {
      imageJSX = (
        <TouchableOpacity
          style={styles.studentImage}
          onPress={this._takePhoto}
        >
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Icon name="plus" size={90} color="#ffffff" />
          </View>
        </TouchableOpacity>
      );
    } else {
      imageJSX = <Image style={styles.studentImage} source={{ uri: image }} />;
    }

    let buttonContents = null;
    if (this.props.spinning) {
      buttonContents = (
        <ActivityIndicator animating color="white" size="small" />
      );
    } else {
      buttonContents = this.props.submitButtonText;
    }

    return (
      <View style={gstyles.flex1}>
        <View style={[gstyles.flex1, styles.form]}>
          {imageJSX}
          <Button
            title="Change photo"
            onPress={this._takePhoto}
          />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder="First Name"
            autoCapitalize="words"
            clearButtonMode="while-editing"
            borderBottomColor={colors.darkGrey}
            onChangeText={text => this._updateState({ firstName: text })}
            defaultValue={this.state.firstName}
            onSubmitEditing={Keyboard.dismiss}
          />
          <LinedTextInput
            style={[styles.input, styles.margin]}
            placeholder="Last Initial"
            maxLength={1}
            autoCapitalize="words"
            clearButtonMode="while-editing"
            borderBottomColor={colors.darkGrey}
            onChangeText={text => this._updateState({ lastInitial: text })}
            defaultValue={this.state.lastInitial}
            onSubmitEditing={Keyboard.dismiss}
          />
          {this.props.children}
        </View>
        <CustomButton
          onPress={this._submit}
          disabled={this.state.disabled}
          content={buttonContents}
        />
      </View>
    );
  }
}

ProfileForm.propTypes = {
  firstName: PropTypes.string,
  lastInitial: PropTypes.string,
  isDisabled: PropTypes.func,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func,
  spinning: PropTypes.bool,
  children: PropTypes.node,
};

ProfileForm.defaultProps = {
  firstName: '',
  lastInitial: '',
  isDisabled: () => ({ invalid: false, same: true }),
  submitButtonText: 'Done',
  onSubmit: () => {},
  spinning: false,
  children: null,
};

export default ProfileForm;
