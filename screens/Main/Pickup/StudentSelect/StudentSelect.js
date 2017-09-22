
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import MyButton from '../../../../components/Button';
import MessageView from '../../../../components/MessageView';
import CachedImage from '../../../../components/CachedImage';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as StudentActions } from '../../../../actions/Student';
import { Actions as UserActions } from '../../../../actions/User';
import { Actions as PickupActions } from '../../../../actions/Pickup';

class StudentSelect extends React.Component {
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
      existingPickup: props.pickup,
      students: [],
      disabled: true,
    };

    this._selectStudent = this._selectStudent.bind(this);
    this._cancelPickup = this._cancelPickup.bind(this);
    this._configure = this._configure.bind(this);
  }

  state: {
    existingPickup: Object,
    students: Object[],
    disabled: boolean,
  }

  componentWillMount() {
    this.props.listenStudents(this.props.user.uid);
  }

  componentWillReceiveProps(nextProps) {
    // For when a pickup is canceled by you or someone else.
    if (nextProps.pickup === null) {
      this.setState({ existingPickup: null });
    }
  }

  componentWillUnmount() {
    this.props.unlistenStudents();
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

  _cancelPickup() {
    this.setState({ existingPickup: null });
    this.props.cancelPickup(this.props.pickup);
  }

  _configure() {
    this.props.navigate('ConfigurePickup', { students: this.state.students });
    this.setState({ students: [], disabled: true });
  }

  render() {
    if (this.state.existingPickup) {
      return (
        <View style={[gstyles.flex1, gstyles.flexCenter]}>
          <View style={styles.dialog}>
            <Text style={gstyles.font18}>Continue your previous pickup?</Text>
            <View style={[gstyles.marginTop10, gstyles.flexRow, { alignItems: 'center' }]}>
              <View style={gstyles.flex1}>
                <Button
                  onPress={this._cancelPickup}
                  title="Cancel"
                  color="red"
                />
              </View>
              <View style={{ width: 10 }} />
              <View style={gstyles.flex1}>
                <Button
                  onPress={() => {
                    this.setState({ existingPickup: null });
                    this.props.resumePickup(this.props.pickup);
                  }}
                  title="Continue"
                />
              </View>
            </View>
          </View>
        </View>
      );
    }

    let studentViews = null;
    if (this.props.students.length > 0) {
      studentViews = this.props.students.map((student) => {
        if (typeof student === 'object') {
          const selected = this.state.students.includes(student);
          return (
            <TouchableOpacity
              key={student.key}
              style={[styles.student, selected ? { borderColor: colors.buttonBackground } : {}]}
              onPress={() => this._selectStudent(student)}
            >
              <CachedImage
                style={styles.studentImage}
                source={{ uri: student.image }}
              />
              <Text style={[styles.studentName, gstyles.marginTop10]}>
                {student.firstName} {student.lastInitial} ({student.grade})
              </Text>
            </TouchableOpacity>
          );
        }
        // If the student information isn't loaded yet, show a blank view.
        return <View key={student} />;
      });
    }

    return (
      <MessageView style={[gstyles.flex1, gstyles.flexStart]}>
        {this.props.students.length === 0 ?
          <View style={[gstyles.flex1, gstyles.flexCenter]}>
            <Button
              onPress={() => this.props.navigate('AddStudent')}
              title="Add your student"
            />
          </View>
          :
          <View style={gstyles.flex1}>
            <ScrollView contentContainerStyle={[gstyles.marginH15, styles.students]}>
              {studentViews}
            </ScrollView>
            <MyButton
              style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}
              disabled={this.state.students.length < 1}
              onPress={this._configure}
              content="Pickup"
              round
            />
          </View>
        }
      </MessageView>
    );
  }
}

StudentSelect.propTypes = {
  user: PropTypes.object.isRequired,
  students: PropTypes.array.isRequired,
  pickup: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  resumePickup: PropTypes.func.isRequired,
  cancelPickup: PropTypes.func.isRequired,
  listenStudents: PropTypes.func.isRequired,
  unlistenStudents: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  students: state.student.students,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(StudentActions, dispatch),
  ...bindActionCreators(UserActions, dispatch),
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentSelect);
