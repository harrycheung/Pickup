
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors } from '../../../../config/styles';
import StudentForm from '../../../../components/StudentForm';
import Button from '../../../../components/Button';
import { Actions as StudentActions } from '../../../../actions/Student';

class EditStudent extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { student, deleteStudent } = navigation.state.params;
    return {
      title: 'Edit',
      headerRight: (
        <TouchableOpacity
          onPress={() => deleteStudent(student.key)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            marginHorizontal: 15,
          }}
        >
          <Icon name='md-trash' size={30} color={colors.black} />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      deleteStudent: this.props.deleteStudent,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StudentForm
          {...this.props.navigation.state.params.student}
          onSubmit={this._edit.bind(this)}
        />
      </View>
    );
  }

  _edit(firstName, lastInitial, grade, relationship) {
    this.props.editStudent({
      key: this.props.navigation.state.params.student.key,
      firstName,
      lastInitial,
      grade,
      relationship
    });
  }
}

EditStudent.propTypes = {
  editStudent: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(StudentActions, dispatch),
});

export default connect(null, mapDispatchToProps)(EditStudent);
