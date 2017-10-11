
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Button,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ImagePicker } from 'expo';

import * as C from '../config/constants';
import { gstyles } from '../config/styles';
import LinedTextInput from './LinedTextInput';
import KeyboardAwareView from './KeyboardAwareView';
import CustomButton from './Button';
import CachedImage from './CachedImage';
import { Actions as ImageActions } from '../actions/Image';
import { Actions as MessageActions } from '../actions/Message';

class ProfileForm extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      disabled: true,
      firstName: this.props.firstName,
      lastInitial: this.props.lastInitial,
      imageURL: this.props.imageURL,
    };

    this._takePhoto = this._takePhoto.bind(this);
    this._pickPhoto = this._pickPhoto.bind(this);
    this._submit = this._submit.bind(this);
    this._updateState = this._updateState.bind(this);
  }

  state: {
    disabled: boolean,
    firstName: string,
    lastInitial: string,
    imageURL: string,
  };

  componentDidUpdate() {
    if (!this.props.spinning) {
      this.updateDisabled();
    }
  }

  updateDisabled() {
    const { state, props } = this;
    const { invalid, same } = props.isDisabled();
    const disabled = (
      state.firstName.length < 1 ||
      state.lastInitial.length < 1 ||
      (props.imageURL.length < 1 && !props.admin) ||
      invalid || (
        state.firstName === props.firstName &&
        state.lastInitial === props.lastInitial &&
        state.imageURL === props.imageURL &&
        same
      )
    );
    if (this.state.disabled !== disabled) {
      this.setState({ disabled });
    }
  }

  async _takePhoto() {
    Keyboard.dismiss();

    const pickerResult = await ImagePicker.launchCameraAsync({
      aspect: [1, 1],
      base64: true,
      exif: true,
      quality: 0.4,
      allowsEditing: true,
    });

    if (!pickerResult.cancelled) {
      this.props.uploadImage(pickerResult.base64);
    }
  }

  async _pickPhoto() {
    Keyboard.dismiss();

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      aspect: [1, 1],
      base64: true,
      exif: true,
      quality: 0.4,
      allowsEditing: true,
    });

    if (!pickerResult.cancelled) {
      this.props.uploadImage(pickerResult.base64);
    }
  }

  _updateState(newState) {
    this.setState(newState, () => {
      this.updateDisabled();
    });
  }

  _submit() {
    this.setState({ disabled: true }, () => {
      const { firstName, lastInitial } = this.state;
      if (this.props.imageURL.length < 1 && this.props.admin) {
        this.props.onSubmit(firstName, lastInitial, C.NoProfile);
      } else {
        this.props.onSubmit(firstName, lastInitial, this.props.imageURL);
      }
    });
  }

  render() {
    let imageJSX = null;
    if (this.props.imageURL === '') {
      imageJSX = <Image style={gstyles.profilePic200} source={{ uri: C.NoProfile }} />;
    } else {
      imageJSX = (
        <CachedImage
          style={[gstyles.profilePic200, { backgroundColor: 'transparent' }]}
          source={{ uri: this.props.imageURL }}
        />
      );
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
        <ScrollView>
          <KeyboardAwareView
            style={[gstyles.flex1, gstyles.marginH15]}
            aboveFoldInput
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[gstyles.flexCenter, { paddingTop: 15 }]}>
                {imageJSX}
                <View style={[gstyles.marginTop10, gstyles.flexRow]}>
                  <View style={gstyles.flex1}>
                    <Button
                      title={'Use camera'}
                      onPress={this._takePhoto}
                    />
                  </View>
                  <View style={[gstyles.flex1, { borderLeftWidth: 1, borderColor: 'lightgray' }]}>
                    <Button
                      style={gstyles.flex1}
                      title={'Pick from library'}
                      onPress={this._pickPhoto}
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Text style={gstyles.marginTop10}>Name</Text>
            <View style={{ flexDirection: 'row' }}>
              <LinedTextInput
                style={{ flex: 1, marginRight: 10 }}
                placeholder="First Name"
                autoCapitalize="words"
                clearButtonMode="while-editing"
                onChangeText={text => this._updateState({ firstName: text.trim() })}
                defaultValue={this.state.firstName}
                onSubmitEditing={Keyboard.dismiss}
                keyboardAwareInput
              />
              <LinedTextInput
                style={{ flex: 1 }}
                placeholder="Last Initial"
                maxLength={1}
                autoCapitalize="words"
                clearButtonMode="while-editing"
                onChangeText={text => this._updateState({ lastInitial: text.trim() })}
                defaultValue={this.state.lastInitial}
                onSubmitEditing={Keyboard.dismiss}
                keyboardAwareInput
              />
            </View>
            {this.props.children}
            {this.props.usePadding &&
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[gstyles.flex1, gstyles.flexStretch]} />
              </TouchableWithoutFeedback>
            }
          </KeyboardAwareView>
        </ScrollView>
        <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: 'darkgray' }}>
          <CustomButton
            onPress={this._submit}
            disabled={this.state.disabled}
            content={buttonContents}
            round
          />
        </View>
      </View>
    );
  }
}

ProfileForm.propTypes = {
  admin: PropTypes.bool,
  firstName: PropTypes.string,
  lastInitial: PropTypes.string,
  imageURL: PropTypes.string,
  isDisabled: PropTypes.func,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func,
  uploadImage: PropTypes.func,
  spinning: PropTypes.bool,
  children: PropTypes.node,
  usePadding: PropTypes.bool,
};

ProfileForm.defaultProps = {
  admin: false,
  firstName: '',
  lastInitial: '',
  imageURL: '',
  isDisabled: () => ({ invalid: false, same: true }),
  submitButtonText: 'Done',
  onSubmit: () => {},
  uploadImage: () => {},
  spinning: false,
  children: null,
  usePadding: false,
};

const mapStateToProps = state => ({
  imageURL: state.image.url,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(ImageActions, dispatch),
  ...bindActionCreators(MessageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ProfileForm);