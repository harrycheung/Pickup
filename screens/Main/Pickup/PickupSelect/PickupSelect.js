
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import drawerHeader from '../../../../components/DrawerHeader';
import Button from '../../../../components/Button';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as NavActions } from '../../../../actions/Navigation';

class PickupSelect extends React.Component {
  state: {
    studentKeys: string[],
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
      studentKeys: [],
    };
  }

  render() {
    let studentViews = null;
    if (this.props.students.length == 0) {
      studentViews = (
        <View style={styles.message}>
          <Text style={styles.messageText}>
            Let's add your student
          </Text>
          <Button
            style={[styles.pickupButton, styles.messageButton]}
            onPress={() => this.props.navigate('AddStudent')}
          >
            <Text style={styles.pickupButtonText}>
              Add student
            </Text>
          </Button>
        </View>
      );
    } else {
      studentViews = this.props.students.map((student) => {
        const selected = this.state.studentKeys.includes(student.key);
        const style = [styles.studentImage, selected ? styles.selected : {}];
        return (
          <TouchableOpacity
            key={student.key}
            style={styles.student}
            onPress={this._selectStudent.bind(this, student.key)}
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
          style={styles.pickupButton}
          disabled={this.state.studentKeys.length < 1}
          onPress={this._pickup.bind(this)}
        >
          <Text style={styles.pickupButtonText}>Pickup</Text>
        </Button>
      </View>
    );
  }

  _selectStudent(key) {
    if (this.state.studentKeys.includes(key)) {
      this.setState({studentKeys: this.state.studentKeys.filter((studentKey) => (studentKey != key))});
    } else {
      this.setState({studentKeys: this.state.studentKeys.concat([key])});
    }
  }

  _pickup() {
    this.props.pickup(this.state.studentKeys);
  }
}

PickupSelect.propTypes = {
  students: PropTypes.array.isRequired,
  pickup: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  students: state.data.students,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupSelect);
