
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../../config/styles';
import StudentForm from '../../../../components/StudentForm';
import { Actions as StudentActions } from '../../../../actions/Student';
import { Actions as ImageActions } from '../../../../actions/Image';

class EditStudent extends React.Component {
  static navigationOptions = ({ navigation }) => {
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
          <Icon name="md-trash" size={30} color={colors.black} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);

    this._edit = this._edit.bind(this);
  }

  componentWillMount() {
    this.props.setImage(this.props.navigation.state.params.student.image);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      deleteStudent: this.props.deleteStudent,
    });
  }

  _edit(firstName, lastInitial, imageURL, grade, relationship) {
    this.props.editStudent({
      key: this.props.navigation.state.params.student.key,
      firstName,
      lastInitial,
      image: imageURL,
      grade,
      relationship,
    });
  }

  render() {
    return (
      <StudentForm
        {...this.props.navigation.state.params.student}
        onSubmit={this._edit}
      />
    );
  }
}

EditStudent.propTypes = {
  navigation: PropTypes.object.isRequired,
  editStudent: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(StudentActions, dispatch),
  ...bindActionCreators(ImageActions, dispatch),
});

export default connect(null, mapDispatchToProps)(EditStudent);
