
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Button,
  Image,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ImagePicker } from 'expo';

import { colors, gstyles } from '../../config/styles';
import LinedTextInput from '../LinedTextInput';
import KeyboardAwareView from '../KeyboardAwareView';
import CustomButton from '../Button';
import { Actions as ImageActions } from '../../actions/Image';
import { Actions as MessageActions } from '../../actions/Message';

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
      props.imageURL.length < 1 ||
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
      this.props.onSubmit(firstName, lastInitial, this.props.imageURL);
    });
  }

  render() {
    let imageJSX = null;
    if (this.props.imageURL === '') {
      imageJSX = (
        <TouchableOpacity
          style={gstyles.profilePic200}
          onPress={this._takePhoto}
        >
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Icon name="plus" size={90} color="#ffffff" />
          </View>
        </TouchableOpacity>
      );
    } else {
      imageJSX = (
        <Image
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
        <KeyboardAwareView
          style={[gstyles.flex1, gstyles.marginH15, gstyles.marginTop10]}
          centerOnInput
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={gstyles.flexCenter}>
              {imageJSX}
              <View style={gstyles.marginTop10}>
                <Button
                  title={this.props.imageURL === '' ? "Upload photo" : "Change photo"}
                  onPress={this._takePhoto}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
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
