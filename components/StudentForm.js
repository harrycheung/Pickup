
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';

import * as c from '../config/constants';
import ProfileForm from './ProfileForm';
import LinedTextInput from './LinedTextInput';
import Picker from './Picker';

class StudentForm extends React.Component {
  state: {
    grade: string,
    relationship: string,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      grade: this.props.grade,
      relationship: this.props.relationship,
    };
  }

  componentDidMount() {
    this._updateState({});
  }

  render() {
    return (
      <ProfileForm
        ref='profileForm'
        firstName={this.props.firstName}
        lastInitial={this.props.lastInitial}
        isDisabled={this._disabled.bind(this)}
        submitButtonText={this.props.submitButtonText}
        onSubmit={this._submit.bind(this)}
      >
        <Text style={[styles.pickerLabel, styles.margin]}>Level</Text>
        <Picker
          style={StyleSheet.flatten(styles.picker)}
          values={c.Levels}
          onChange={(value) => this._updateState({grade: value})}
          value={this.state.grade}
        />
        <Text style={[styles.pickerLabel, styles.margin]}>Relationship to Student</Text>
        <Picker
          style={StyleSheet.flatten(styles.picker)}
          values={c.Relationships}
          onChange={(value) => this._updateState({relationship: value})}
          value={this.state.relationship}
        />
      </ProfileForm>
    );
  }

  _updateState(newState) {
    this.setState(newState, () => {
      this.refs.profileForm.updateDisabled();
    });
  }

  _disabled() {
    const { state, props } = this;
    return {
      invalid: state.grade.length < 1 || state.relationship.length < 1,
      same: (
        state.grade === props.grade &&
        state.relationship === props.relationship
      )
    };
  }

  _submit(firstName, lastInitial) {
    const { grade, relationship } = this.state;
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
};

const styles = StyleSheet.create({
  margin: {
    marginTop: 10,
  },
  pickerLabel: {
    alignSelf: 'flex-start',
  },
  picker: {
    alignSelf: 'stretch',
    marginTop: 5,
  }
});

export default StudentForm;
