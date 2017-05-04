
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import StudentForm from '../../../../components/StudentForm';
import { Actions as DataActions } from '../../../../actions/Data';

class AddStudent extends React.Component {
  static navigationOptions = {
    title: 'Add',
  };

  render() {
    return (
      <View style={styles.container}>
        <StudentForm onSubmit={this.props.addStudent} />
      </View>
    );
  }
}

AddStudent.propTypes = {
  addStudent: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(DataActions, dispatch),
});

export default connect(null, mapDispatchToProps)(AddStudent);
