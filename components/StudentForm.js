
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import * as C from '../config/constants';
import { colors, gstyles } from '../config/styles';
import { validPhoneNumber } from '../helpers';
import ProfileForm from './ProfileForm';
import Picker from './Picker';
import IconButton from './IconButton';
import LinedTextInput from './LinedTextInput';

const styles = StyleSheet.create({
  pickerLabel: {
    ...Platform.select({
      ios: {
        alignSelf: 'flex-start',
      },
      android: {
        fontSize: 18,
        marginTop: 12,
        marginRight: 20,
      },
    }),
  },
  relationshipsHeader: {
    marginTop: 15,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalBackground: {
    backgroundColor: 'darkgray',
    opacity: 0.7,
  },
  modal: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: colors.buttonBackground,
    padding: 10,
  },
});

class StudentForm extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      grade: this.props.grade,
      data: this._loadRelationships(this.props.relationships),
      showAddModal: false,
      addRelPhone: '',
      addRelRelationship: 'Parent',
      addRelDisabled: true,
    };

    this._disabled = this._disabled.bind(this);
    this._submit = this._submit.bind(this);
    this._updateState = this._updateState.bind(this);
    this._addRelationshipPhone = this._addRelationshipPhone.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  state: {
    grade: string,
    data: Array<Object>,
    showAddModal: boolean,
    addRelPhone: string,
    addRelRelationship: string,
    addRelDisabled: boolean,
  }

  componentDidMount() {
    this._updateState({});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.relationships !== nextProps.relationships) {
      this.setState({
        data: this._loadRelationships(nextProps.relationships),
      });
    }
  }

  profileForm: Object
  phoneInput: Object

  _loadRelationships(obj) {
    const relationships = [];
    Object.keys(obj).forEach((key) => {
      const relationship = obj[key];
      if (key !== this.props.uid) {
        relationships.push(Object.assign({}, relationship, { key }));
      }
    });
    return relationships;
  }

  _updateState(newState) {
    this.setState(newState, () => {
      this.profileForm.getWrappedInstance().updateDisabled();
    });
  }

  _disabled() {
    const { state, props } = this;
    return {
      invalid: state.grade.length < 1,
      same: state.grade === props.grade,
    };
  }

  _submit(firstName, lastInitial, imageURL) {
    this.props.onSubmit(firstName, lastInitial, imageURL, this.state.grade);
  }

  _addRelationshipPhone(phoneNumber) {
    const disabled = !validPhoneNumber(phoneNumber) || phoneNumber === this.props.uid;
    this.setState({ addRelDisabled: disabled, addRelPhone: phoneNumber });
  }

  _closeModal() {
    this.setState({
      showAddModal: false,
      addRelPhone: '',
      addRelRelationship: 'Parent',
      addRelDisabled: true,
    });
  }

  render() {
    let content = null;
    if (this.props.mode === 'add') {
      content = (
        <View style={gstyles.marginTop10}>
          <Text style={styles.pickerLabel}>Level</Text>
          <Picker
            values={C.Levels}
            onChange={value => this._updateState({ grade: value })}
            value={this.state.grade}
            columns={4}
          />
        </View>
      );
    } else if (this.props.mode === 'edit') {
      content = (
        <View style={[gstyles.flex1, gstyles.flexStretch]}>
          <Text style={[styles.pickerLabel, gstyles.marginTop10]}>
            Level: {this.props.grade}
          </Text>
          <View style={gstyles.flex1}>
            <View style={styles.relationshipsHeader}>
              <Text style={[gstyles.font18, { marginRight: 15 }]}>
                Other relationships:
              </Text>
              <IconButton
                icon="md-add"
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ showAddModal: true });
                }}
              />
            </View>
            <View style={gstyles.flex1}>
              <FlatList
                style={gstyles.flex1}
                data={this.state.data}
                renderItem={({ item }) => (
                  <View
                    style={[
                      {
                        paddingVertical: 5,
                        alignItems: 'center',
                      },
                      gstyles.flexRow,
                    ]}
                  >
                    <Image
                      style={[gstyles.profilePic40, { marginRight: 10 }]}
                      source={{ uri: item.image }}
                    />
                    <Text style={[gstyles.font18, { marginRight: 10 }]}>
                      {item.name} ({item.role})
                    </Text>
                    <IconButton
                      icon="md-trash"
                      onPress={() => {
                        Alert.alert(
                          'Remove relationship?',
                          null,
                          [
                            { text: 'Cancel', onPress: null, style: 'cancel' },
                            { text: 'OK',
                              onPress: () => this.props.removeRelationship(item.key),
                            },
                          ],
                          { cancelable: false },
                        );
                      }}
                    />
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={gstyles.flex1}>
        <ProfileForm
          ref={(form) => { this.profileForm = form; }}
          firstName={this.props.firstName}
          lastInitial={this.props.lastInitial}
          isDisabled={this._disabled}
          submitButtonText={this.props.submitButtonText}
          onSubmit={this._submit}
          usePadding={this.props.mode === 'add'}
        >
          {content}
        </ProfileForm>
        {this.state.showAddModal &&
          <View style={[styles.modalContainer]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[styles.modalContainer, styles.modalBackground]} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[styles.modal, gstyles.marginH15, gstyles.marginTop10]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={gstyles.font18}>
                    Add Relationship
                  </Text>
                  <View style={gstyles.flex1} />
                  <IconButton icon="md-close" onPress={this._closeModal} />
                </View>
                <LinedTextInput
                  ref={(input) => { this.phoneInput = input; }}
                  style={gstyles.marginTop10}
                  placeholder="Phone number"
                  maxLength={10}
                  clearButtonMode="while-editing"
                  borderBottomColor={colors.darkGrey}
                  keyboardType="phone-pad"
                  onChangeText={this._addRelationshipPhone}
                />
                <View style={gstyles.marginTop10}>
                  <Text style={styles.pickerLabel}>
                    Relationship to Student
                  </Text>
                  <Picker
                    style={[gstyles.flexStretch, gstyles.marginTop10]}
                    values={C.Relationships}
                    onChange={(value) => {
                      this._updateState({ addRelRelationship: value });
                      this.phoneInput.blur();
                    }}
                    value={this.state.addRelRelationship}
                    columns={2}
                  />
                </View>
                <View style={{ marginTop: 20 }}>
                  <Button
                    onPress={() => {
                      this.props.addRelationship(
                        this.state.addRelPhone,
                        this.state.addRelRelationship,
                      );
                      this._closeModal();
                    }}
                    disabled={this.state.addRelDisabled}
                    title="Add"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        }
      </View>
    );
  }
}

StudentForm.propTypes = {
  uid: PropTypes.string,
  mode: PropTypes.string,
  firstName: PropTypes.string,
  lastInitial: PropTypes.string,
  grade: PropTypes.string,
  relationships: PropTypes.object,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  addRelationship: PropTypes.func,
  removeRelationship: PropTypes.func,
};

StudentForm.defaultProps = {
  uid: '',
  mode: 'add',
  firstName: '',
  lastInitial: '',
  grade: '',
  relationships: {},
  submitButtonText: 'Done',
  addRelationship: () => {},
  removeRelationship: () => {},
};

export default StudentForm;
