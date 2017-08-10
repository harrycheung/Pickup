
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
import MessageView from '../../../../components/MessageView';

class PickupSelect extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Synapse Pickup',
      headerBackTitle: 'Cancel',
      drawerLabel: 'Home',
    })
  );

  static defaultProps = {
    pickup: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      students: [],
      showExistingPickup: props.pickup !== null,
    };

    this._selectStudent = this._selectStudent.bind(this);
    this._pickup = this._pickup.bind(this);
  }

  state: {
    students: Object[],
    showExistingPickup: boolean,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showExistingPickup: nextProps.pickup !== null });
  }

  _selectStudent(selectedStudent) {
    if (this.state.students.includes(selectedStudent)) {
      this.setState({
        students: this.state.students.filter(student => (student !== selectedStudent)),
      });
    } else {
      this.setState({
        students: this.state.students.concat([selectedStudent]),
      });
    }
  }

  _pickup() {
    this.props.createPickup(this.props.user, this.state.students);
    this.setState({ students: [] });
  }

  render() {
    if (this.state.showExistingPickup) {
      return (
        <View style={[gstyles.flex1, gstyles.flexStart]}>
          <View style={styles.pickup}>
            <Text style={gstyles.font18}>Continue your previous pickup?</Text>
            <View style={[gstyles.marginTop10, { flexDirection: 'row' }]}>
              <Button
                style={gstyles.flex1}
                onPress={() => this.props.cancelPickup(this.props.pickup)}
                content="Cancel"
                backgroundColor="darkgray"
              />
              <View style={{ width: 10 }} />
              <Button
                style={gstyles.flex1}
                onPress={() => this.props.resumePickup(this.props.pickup)}
                content="Continue"
              />
            </View>
          </View>
        </View>
      );
    }

    let studentViews = null;
    if (this.props.students.length === 0) {
      studentViews = (
        <View style={gstyles.flexCenter}>
          <Text style={gstyles.font18}>
            {"Let's add your student"}
          </Text>
          <Button
            style={gstyles.marginTop10}
            onPress={() => this.props.navigate('AddStudent')}
            content="Add student"
          />
        </View>
      );
    } else {
      studentViews = this.props.students.map((student) => {
        const selected = this.state.students.includes(student);
        const style = [gstyles.profilePic100, selected ? styles.selected : {}];
        return (
          <TouchableOpacity
            key={student.key}
            style={styles.student}
            onPress={() => this._selectStudent(student)}
          >
            <Image style={style} source={{ uri: student.image }} />
            <Text style={gstyles.font18}>
              {student.firstName} {student.lastInitial} ({student.grade})
            </Text>
          </TouchableOpacity>
        );
      });
    }

    return (
      <MessageView style={[gstyles.flex1, gstyles.flexStart]}>
        <ScrollView contentContainerStyle={[gstyles.flex1, gstyles.marginH15, styles.students]}>
          {studentViews}
        </ScrollView>
        <Button
          disabled={this.state.students.length < 1}
          onPress={this._pickup}
          content="Pickup"
        />
      </MessageView>
    );
  }
}

PickupSelect.propTypes = {
  user: PropTypes.object.isRequired,
  students: PropTypes.array.isRequired,
  createPickup: PropTypes.func.isRequired,
  pickup: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  resumePickup: PropTypes.func.isRequired,
  cancelPickup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  students: state.student.students,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupSelect);
