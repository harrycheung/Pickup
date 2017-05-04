
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import drawerHeader from '../../components/DrawerHeader';
import LinedTextInput from '../LinedTextInput';
import Picker from '../Picker';
import Button from '../Button';

class ProfileForm extends React.Component {
  state: {
    disabled: boolean,
    firstName: string,
    lastInitial: string,
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
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    this.setState({disabled: nextProps.spinning});
  }

  render() {
    let image = null;
    if (this.state.image === null) {
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
          {image}
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
        <Button
          onPress={this._submit.bind(this)}
          style={styles.submitButton}
          disabled={this.state.disabled}
        >
          {buttonContents}
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
