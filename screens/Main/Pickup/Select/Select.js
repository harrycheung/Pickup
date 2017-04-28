
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import drawerHeader from '../../../../helpers/DrawerHeader';
import Button from '../../../../components/Button';
import { actions as dataActions } from '../../../../actions/data';

class Select extends React.Component {
  state: {
    studentKeys: string[],
  }

  static navigationOptions = {
    title: 'Synapse Pickup',
    drawer: {
      label: 'Synapse Pickup',
    },
    header: drawerHeader,
  };

  constructor(props) {
    super(props);

    this.state = {
      studentKeys: [],
    };
  }

  render() {
    const studentViews = this.props.students.map((student) => {
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

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.students}>
          {studentViews}
        </ScrollView>
        <Button
          style={styles.pickupButton}
          disabled={this.state.studentKeys.length < 1}
          onPress={this._pickup.bind(this)}>
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

Select.propTypes = {
  students: PropTypes.array.isRequired,
  pickup: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  students: state.data.students,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(dataActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Select);
