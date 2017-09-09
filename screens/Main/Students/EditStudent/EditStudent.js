
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { gstyles } from '../../../../config/styles';
import StudentForm from '../../../../components/StudentForm';
import MessageView from '../../../../components/MessageView';
import { Actions as StudentActions } from '../../../../actions/Student';
import { Actions as ImageActions } from '../../../../actions/Image';

class EditStudent extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { student, deleteStudent } = navigation.state.params;
    return {
      title: 'Edit',
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Remove student?',
              null,
              [
                { text: 'Cancel', onPress: null, style: 'cancel' },
                { text: 'OK',
                  onPress: () => deleteStudent(student.key),
                },
              ],
              { cancelable: false },
            );
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            marginHorizontal: 15,
          }}
        >
          <Icon name="md-trash" size={30} color="white" />
        </TouchableOpacity>
      ),
    };
  };

  static loadStudent = (students, key) => (
    students.find(element => (
      element.key === key
    ))
  );

  constructor(props) {
    super(props);

    const { key } = props.navigation.state.params.student;
    this.state = {
      key,
      student: EditStudent.loadStudent(props.students, key),
    };

    this._edit = this._edit.bind(this);
  }

  state: {
    key: string,
    student: Object,
  };

  componentWillMount() {
    this.props.setImage(this.state.student.image);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      deleteStudent: this.props.deleteStudent,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      student: EditStudent.loadStudent(nextProps.students, this.state.key),
    });
  }

  _edit(firstName, lastInitial, imageURL, grade) {
    this.props.editStudent({
      ...this.state.student,
      firstName,
      lastInitial,
      image: imageURL,
      grade,
    });
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <StudentForm
          uid={this.props.uid}
          mode="edit"
          {...this.state.student}
          onSubmit={this._edit}
          addRelationship={(uid, relationship) =>
            this.props.addRelationship(this.state.key, uid, relationship)
          }
          removeRelationship={uid =>
            this.props.removeRelationship(this.state.key, uid)
          }
        />
      </MessageView>
    );
  }
}

EditStudent.propTypes = {
  uid: PropTypes.string.isRequired,
  students: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  editStudent: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
  addRelationship: PropTypes.func.isRequired,
  removeRelationship: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  uid: state.user.uid,
  students: state.student.students,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(StudentActions, dispatch),
  ...bindActionCreators(ImageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditStudent);
