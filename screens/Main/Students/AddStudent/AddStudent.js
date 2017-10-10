
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
      <MessageView style={gstyles.flex1}>
        <StudentForm onSubmit={this.props.addStudent} admin={this.props.admin} />
      </MessageView>
    );
  }
}

AddStudent.propTypes = {
  admin: PropTypes.bool.isRequired,
  addStudent: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  admin: state.user.admin,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(StudentActions, dispatch),
  ...bindActionCreators(ImageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStudent);
