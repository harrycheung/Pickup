
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import drawerHeader from '../../../../components/DrawerHeader';
import Button from '../../../../components/Button';
import { Actions as NavActions } from '../../../../actions/Navigation';

class PickupSelect extends React.Component {
  state: {
    students: string[],
  }

  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Synapse Pickup',
      headerBackTitle: 'Cancel',
      drawerLabel: 'Home',
    })
  );

  constructor(props) {
    super(props);

    this.state = {
      students: [],
    };
  }

  render() {
    let studentViews = null;
    if (this.props.students.length == 0) {
      studentViews = (
        <View style={styles.message}>
          <Text style={styles.messageText}>
            {"Let's add your student"}
          </Text>
          <Button
            style={styles.messageButton}
            onPress={() => this.props.navigate('AddStudent')}
            content='Add student'
          />
        </View>
      );
    } else {
      studentViews = this.props.students.map((student) => {
        const selected = this.state.students.includes(student);
        const style = [styles.studentImage, selected ? styles.selected : {}];
        return (
          <TouchableOpacity
            key={student.key}
            style={styles.student}
            onPress={this._selectStudent.bind(this, student)}
          >
            <Image style={style} source={require('../../../../images/max.png')} />
            <Text style={styles.studentName}>
              {student.firstName} {student.lastInitial}
            </Text>
          </TouchableOpacity>
        );
      });
    }

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.students}>
          {studentViews}
        </ScrollView>
        <Button
          disabled={this.state.students.length < 1}
          onPress={this._pickup.bind(this)}
          content='Pickup'
        />
      </View>
    );
  }

  _selectStudent(selectedStudent) {
    if (this.state.students.includes(selectedStudent)) {
      this.setState({students: this.state.students.filter((student) => (student !== selectedStudent))});
    } else {
      this.setState({students: this.state.students.concat([selectedStudent])});
    }
  }

  _pickup() {
    this.props.navigate('PickupRequest', {students: this.state.students});
    this.setState({students: []});
  }
}

PickupSelect.propTypes = {
  students: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  students: state.student.students,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupSelect);
