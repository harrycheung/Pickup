
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BlurView } from 'expo';
import Icon from 'react-native-vector-icons/Ionicons';

import * as C from '../../../../config/constants';
import styles from './styles';
import { gstyles } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import Button from '../../../../components/Button';
import MessageView from '../../../../components/MessageView';
import Picker from '../../../../components/Picker';
import IconButton from '../../../../components/IconButton';
import LinedTextInput from '../../../../components/LinedTextInput';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as StudentActions } from '../../../../actions/Student';
import { Actions as UserActions } from '../../../../actions/User';

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
      configurePickup: false,
      showAddVehicle: false,
      addVehicle: '',
      location: '',
      vehicle: 'In person',
    };

    this._selectStudent = this._selectStudent.bind(this);
    this._configure = this._configure.bind(this);
    this._pickup = this._pickup.bind(this);
    this._cancelPickup = this._cancelPickup.bind(this);
    this._addVehicle = this._addVehicle.bind(this);
    this._clearConfigurePickup = this._clearConfigurePickup.bind(this);
  }

  state: {
    existingPickup: Object,
    students: Object[],
    configurePickup: boolean,
    showAddVehicle: boolean,
    addVehicle: string,
    location: string,
    vehicle: string,
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

  _configure() {
    this.setState({ configurePickup: true });
  }

  _pickup() {
    this.props.createPickup(
      this.props.user,
      this.state.students,
      this.state.location,
      this.state.vehicle,
    );
    this._clearConfigurePickup();
  }

  _cancelPickup() {
    this.setState({ existingPickup: null });
    this.props.cancelPickup(this.props.pickup);
  }

  _addVehicle() {
    this.props.addVehicle(this.state.addVehicle);
    this.setState({ showAddVehicle: false, addVehicle: '' });
  }

  _clearConfigurePickup() {
    this.setState({
      students: [],
      configurePickup: false,
      showAddVehicle: false,
      addVehicle: '',
      location: '',
      vehicle: '',
    });
  }

  render() {
    if (this.state.existingPickup) {
      return (
        <View style={[gstyles.flex1, gstyles.flexStart]}>
          <View style={styles.pickup}>
            <Text style={gstyles.font18}>Continue your previous pickup?</Text>
            <View style={[gstyles.marginTop10, { flexDirection: 'row' }]}>
              <Button
                style={gstyles.flex1}
                onPress={this._cancelPickup}
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
        if (typeof student === 'object') {
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
        }
        return <View key={student} />
      });
    }

    return (
      <MessageView style={[gstyles.flex1, gstyles.flexStart]}>
        <ScrollView contentContainerStyle={[gstyles.flex1, gstyles.marginH15, styles.students]}>
          {studentViews}
        </ScrollView>
        <Button
          disabled={this.state.students.length < 1}
          onPress={this._configure}
          content="Pickup"
        />
        {this.state.configurePickup &&
          <View style={styles.configureModal}>
            <KeyboardAwareView
              style={[gstyles.flex1, {
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'center',
              }]}
              centerOnInput
            >
              <TouchableWithoutFeedback
                onPress={this._clearConfigurePickup}
              >
                <BlurView style={[styles.configureModal]} tint="light" intensity={75} />
              </TouchableWithoutFeedback>
              <View style={[styles.pickup, { alignItems: 'flex-start' }]}>
                <Text style={gstyles.font18}>Where are you?</Text>
                <Picker
                  style={[{ alignSelf: 'stretch' }, gstyles.marginTop10]}
                  values={C.Locations}
                  onChange={value => this.setState({ location: value })}
                  columns={2}
                />
                <View
                  style={[
                    {
                      alignSelf: 'stretch',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    },
                    gstyles.marginTop10]
                  }
                >
                  <Text style={gstyles.font18}>In a car?</Text>
                  {!this.state.showAddVehicle &&
                    <View style={{ marginRight: 5 }}>
                      <IconButton
                        icon="md-add"
                        onPress={() => this.setState({ showAddVehicle: true })}
                      />
                    </View>
                  }
                </View>
                {this.state.showAddVehicle &&
                  <View
                    style={{
                      alignSelf: 'stretch',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <LinedTextInput
                      style={{ flex: 3 }}
                      placeholder="Describe vehicle"
                      autoCapitalize="words"
                      clearButtonMode="while-editing"
                      borderBottomColor={'darkgray'}
                      onChangeText={text => this.setState({ addVehicle: text })}
                      defaultValue=""
                      onSubmitEditing={Keyboard.dismiss}
                      keyboardAwareInput
                    />
                    <View style={{ width: 5 }} />
                    <Button
                      content="Add"
                      disabled={this.state.addVehicle.length < 6}
                      onPress={this._addVehicle}
                    />
                    <View style={{ width: 5 }} />
                    <Button
                      content={(
                        <Icon
                          style={{ marginHorizontal: 10 }}
                          name="md-close"
                          size={24}
                          color="#fff"
                        />
                      )}
                      backgroundColor="darkgray"
                      onPress={() => this.setState({
                        showAddVehicle: false,
                        addVehicle: '',
                      })}
                    />
                  </View>
                }
                <Picker
                  style={[{ alignSelf: 'stretch' }, gstyles.marginTop10]}
                  columns={2}
                  values={['In person'].concat(this.props.user.vehicles)}
                  onChange={vehicle => this.setState({ vehicle })}
                />
                <Button
                  style={{ marginTop: 20 }}
                  disabled={this.state.vehicle === '' || this.state.location === ''}
                  onPress={this._pickup}
                  content="Request Pickup"
                />
              </View>
            </KeyboardAwareView>
          </View>
        }
      </MessageView>
    );
  }
}

StudentSelect.propTypes = {
  user: PropTypes.object.isRequired,
  students: PropTypes.array.isRequired,
  createPickup: PropTypes.func.isRequired,
  pickup: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  resumePickup: PropTypes.func.isRequired,
  cancelPickup: PropTypes.func.isRequired,
  listenStudents: PropTypes.func.isRequired,
  unlistenStudents: PropTypes.func.isRequired,
  addVehicle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  students: state.student.students,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(StudentActions, dispatch),
  ...bindActionCreators(UserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentSelect);
