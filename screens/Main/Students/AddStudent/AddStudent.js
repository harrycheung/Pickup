
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../../config/styles';
import StudentForm from '../../../../components/StudentForm';
import { Actions as StudentActions } from '../../../../actions/Student';
import { Actions as ImageActions } from '../../../../actions/Image';

class AddStudent extends React.Component {
  static navigationOptions = {
    title: 'Add',
  };

  componentWillMount() {
    this.props.setImage('');
  }

  render() {
    return (
      <View style={gstyles.flex1}>
        <StudentForm onSubmit={this.props.addStudent} />
      </View>
    );
  }
}

AddStudent.propTypes = {
  addStudent: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(StudentActions, dispatch),
  ...bindActionCreators(ImageActions, dispatch),
});

export default connect(null, mapDispatchToProps)(AddStudent);
