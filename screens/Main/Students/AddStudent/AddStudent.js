
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../../config/styles';
import StudentForm from '../../../../components/StudentForm';
import MessageView from '../../../../components/MessageView';
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
      <MessageView style={[gstyles.flex1, gstyles.statusBarMargin]}>
        <StudentForm onSubmit={this.props.addStudent} />
      </MessageView>
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
