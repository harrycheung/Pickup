
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Keyboard,
  ListView,
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
import Button from './Button';

const styles = StyleSheet.create({
  pickerLabel: {
    alignSelf: 'flex-start',
  },
  picker: {
    alignSelf: 'stretch',
    marginTop: 5,
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
  static loadRelationships(obj) {
    const relationships = [];
    Object.keys(obj).forEach((key) => {
      const relationship = obj[key];
      if (relationship !== 'Parent') {
        relationships.push(Object.assign({}, relationship, { key }));
      }
    });
    return relationships;
  }

  constructor(props: Object) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      grade: this.props.grade,
      relationship: this.props.relationship,
      relationshipsDS: ds.cloneWithRows(StudentForm.loadRelationships(this.props.relationships)),
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
    relationship: string,
    relationshipsDS: Object,
    showAddModal: boolean,
    addRelPhone: string,
    addRelRelationship: string,
    addRelDisabled: boolean,
  };

  componentDidMount() {
    this._updateState({});
  }

  componentWillReceiveProps(nextProps) {
    console.log('Studentform.componentWillReceiveProps', nextProps.relationships);
    if (this.props.relationships !== nextProps.relationships) {
      console.log('NEW RELATIONSHIPS');
      this.setState({
        relationshipsDS:
          this.state.relationshipsDS.cloneWithRows(
            StudentForm.loadRelationships(nextProps.relationships),
          ),
      });
    }
  }

  profileForm: Object;

  _updateState(newState) {
    this.setState(newState, () => {
      this.profileForm.getWrappedInstance().updateDisabled();
    });
  }

  _disabled() {
    const { state, props } = this;
    return {
      invalid: state.grade.length < 1 || state.relationship.length < 1,
      same: (
        state.grade === props.grade &&
        state.relationship === props.relationship
      ),
    };
  }

  _submit(firstName, lastInitial, imageURL) {
    const { grade, relationship } = this.state;
    this.props.onSubmit(firstName, lastInitial, imageURL, grade, relationship);
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
        <View style={[gstyles.flex1, { alignSelf: 'stretch' }]}>
          <Text style={[styles.pickerLabel, gstyles.marginTop10]}>Level</Text>
          <Picker
            style={StyleSheet.flatten(styles.picker)}
            values={C.Levels}
            onChange={value => this._updateState({ grade: value })}
            value={this.state.grade}
          />
        </View>
      );
    } else if (this.props.mode === 'edit') {
      content = (
        <View style={[gstyles.flex1, { alignSelf: 'stretch' }]}>
          <Text style={[styles.pickerLabel, gstyles.marginTop10]}>
            Level: {this.props.grade}
          </Text>
          {this.props.relationship === 'Parent' &&
            <View style={gstyles.flex1}>
              <View
                style={{
                  marginTop: 15,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}
              >
                <Text style={[gstyles.font18, { marginRight: 15 }]}>
                  Other relationships:
                </Text>
                <IconButton
                  icon="md-add"
                  onPress={() => this.setState({ showAddModal: true })}
                />
              </View>
              <View style={gstyles.flex1}>
                <ListView
                  style={gstyles.flex1}
                  dataSource={this.state.relationshipsDS}
                  enableEmptySections
                  renderRow={(relationship, sectionID, rowID) => (
                    <View
                      key={`${sectionID}-${rowID}`}
                      style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Image
                        style={[gstyles.profilePic40, { marginRight: 10 }]}
                        source={{ uri: relationship.image }}
                      />
                      <Text style={[gstyles.font18, { marginRight: 10 }]}>
                        {relationship.name} ({relationship.role})
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
                                onPress: () => this.props.removeRelationship(relationship.key),
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
          }
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
                  style={[gstyles.textInput, gstyles.marginTop10]}
                  placeholder="Phone number"
                  maxLength={10}
                  clearButtonMode="while-editing"
                  borderBottomColor={colors.darkGrey}
                  keyboardType="phone-pad"
                  onChangeText={this._addRelationshipPhone}
                />
                <Text style={[styles.pickerLabel, gstyles.marginTop10]}>
                  Relationship to Student
                </Text>
                <Picker
                  style={StyleSheet.flatten(styles.picker)}
                  values={C.Relationships}
                  onChange={value => this._updateState({ addRelRelationship: value })}
                  value={this.state.addRelRelationship}
                />
                <Button
                  onPress={() => {
                    this.props.addRelationship(
                      this.state.addRelPhone,
                      this.state.addRelRelationship,
                    );
                    this._closeModal();
                  }}
                  style={{ marginTop: 20 }}
                  disabled={this.state.addRelDisabled}
                  content="Add"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        }
      </View>
    );
  }
}

StudentForm.propTypes = {
  uid: PropTypes.string.isRequired,
  mode: PropTypes.string,
  firstName: PropTypes.string,
  lastInitial: PropTypes.string,
  grade: PropTypes.string,
  relationship: PropTypes.string,
  relationships: PropTypes.object,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  addRelationship: PropTypes.func.isRequired,
  removeRelationship: PropTypes.func.isRequired,
};

StudentForm.defaultProps = {
  mode: 'add',
  firstName: '',
  lastInitial: '',
  grade: '',
  relationship: 'Parent',
  relationships: {},
  submitButtonText: 'Done',
};

export default StudentForm;
