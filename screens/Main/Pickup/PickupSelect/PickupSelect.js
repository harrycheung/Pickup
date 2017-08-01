
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { gstyles } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import Button from '../../../../components/Button';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { StudentCache } from '../../../../helpers';

class PickupSelect extends React.Component {
  props: {
    uid: string,
    pickup: Object,
    students: Object[],
    navigate: (string) => void,
    createPickup: (string, Array<Object>) => void,
    cancelPickup: (Object) => void,
    resumePickup: (Object) => void,
  }
  state: {
    students: Object[],
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
      showExistingPickup: props.pickup !== null,
    };
  }

  componentWilReceiveProps(nextProps) {
    this.setState = {showExistingPickup: nextProps.pickup !== null};
  }

  render() {
    let existingPickup = null;
    if (this.state.showExistingPickup) {
      existingPickup = (
        <View style={styles.pickup}>
          <Text style={gstyles.font18}>Continue your previous pickup?</Text>
          <View style={[styles.pickupButtons, gstyles.marginTop10]}>
            <Button
              style={gstyles.flex1}
              onPress={() => this.props.cancelPickup(this.props.pickup)}
              content='Cancel'
              backgroundColor='darkgray'
            />
            <View style={{width: 10}} />
            <Button
              style={gstyles.flex1}
              onPress={() => this.props.resumePickup(this.props.pickup)}
              content='Continue'
            />
          </View>
        </View>
      );
    }

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
        {existingPickup}
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
    this.props.createPickup(this.props.uid, this.state.students);
    this.setState({students: []});
  }
}

PickupSelect.propTypes = {
  students: PropTypes.array.isRequired,
  createPickup: PropTypes.func.isRequired,
  pickup: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  resumePickup: PropTypes.func.isRequired,
  cancelPickup: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  uid: state.auth.user.uid,
  students: state.student.students,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupSelect);
