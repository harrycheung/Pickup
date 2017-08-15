
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Keyboard,
  ListView,
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
import Button from './Button';

const styles = StyleSheet.create({
  picker: {
    alignSelf: 'stretch',
    ...Platform.select({
      ios: {
        marginTop: 5,
      },
      android: {
        flex: 1,
      },
    }),
  },
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
    })
  },
  pickerContainer: {
    alignSelf: 'stretch',
    ...Platform.select({
      ios: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      android: {
        flexDirection: 'row',
        alignItems: 'stretch',
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
    if (this.props.relationships !== nextProps.relationships) {
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
        <View style={[styles.pickerContainer, gstyles.marginTop10]}>
          <Text style={styles.pickerLabel}>Level</Text>
          <Picker
            style={styles.picker}
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
              <View style={styles.relationshipsHeader}>
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
                  style={[gstyles.textInput, gstyles.marginTop10]}
                  placeholder="Phone number"
                  maxLength={10}
                  clearButtonMode="while-editing"
                  borderBottomColor={colors.darkGrey}
                  keyboardType="phone-pad"
                  onChangeText={this._addRelationshipPhone}
                />
                <View style={[styles.pickerContainer, gstyles.marginTop10]}>
                  <Text style={styles.pickerLabel}>
                    Relationship to Student
                  </Text>
                  <Picker
                    style={styles.picker}
                    values={C.Relationships}
                    onChange={value => this._updateState({ addRelRelationship: value })}
                    value={this.state.addRelRelationship}
                  />
                </View>
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
  uid: PropTypes.string,
  mode: PropTypes.string,
  firstName: PropTypes.string,
  lastInitial: PropTypes.string,
  grade: PropTypes.string,
  relationship: PropTypes.string,
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
  relationship: 'Parent',
  relationships: {},
  submitButtonText: 'Done',
  addRelationship: () => {},
  removeRelationship: () => {},
};

export default StudentForm;
