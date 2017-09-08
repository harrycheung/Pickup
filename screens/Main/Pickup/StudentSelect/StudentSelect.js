
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
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
import { colors, gstyles } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import MyButton from '../../../../components/Button';
import MessageView from '../../../../components/MessageView';
import Picker from '../../../../components/Picker';
// import IconButton from '../../../../components/IconButton';
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
      showVehicle: false,
      addVehicleText: '',
      location: '',
      vehicle: '',
      disabled: true,
    };

    this._selectStudent = this._selectStudent.bind(this);
    this._configure = this._configure.bind(this);
    this._pickup = this._pickup.bind(this);
    this._cancelPickup = this._cancelPickup.bind(this);
    this._addVehicle = this._addVehicle.bind(this);
    this._clearConfigurePickup = this._clearConfigurePickup.bind(this);
    this._setLocation = this._setLocation.bind(this);
    this._changeAddVehicleText = this._changeAddVehicleText.bind(this);
  }

  state: {
    existingPickup: Object,
    students: Object[],
    configurePickup: boolean,
    showVehicle: boolean,
    addVehicleText: string,
    location: string,
    vehicle: string,
    disabled: boolean,
    disabledAddVehicle: boolean,
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

  // vehiclePicker: Object

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
    const vehicle = this.state.addVehicleText;
    this.props.addVehicle(vehicle);
    this.setState({ vehicle, addVehicleText: '' });
    Keyboard.dismiss();
  }

  _clearConfigurePickup() {
    this.setState({
      students: [],
      configurePickup: false,
      showVehicle: false,
      addVehicleText: '',
      location: '',
      vehicle: '',
      disabled: true,
    });
  }

  _setLocation(location) {
    this.setState({
      location,
      showVehicle: location !== 'Playground',
      disabled: location !== 'Playground',
    });
  }

  _changeAddVehicleText(text) {
    this.setState({
      addVehicleText: text,
      disabledAddVehicle: text.length < 6 || this.props.user.vehicles.indexOf(text) > -1,
    });
  }

  render() {
    if (this.state.existingPickup) {
      return (
        <View style={[gstyles.flex1, gstyles.flexStart]}>
          <View style={gstyles.flexRow}>
            <View style={gstyles.flex1} />
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
            <View style={gstyles.flex1} />
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
            title="Add student"
          />
        </View>
      );
    } else {
      studentViews = this.props.students.map((student) => {
        if (typeof student === 'object') {
          const selected = this.state.students.includes(student);
          return (
            <TouchableOpacity
              key={student.key}
              style={[styles.student, selected ? { borderColor: colors.buttonBackground } : {}]}
              onPress={() => this._selectStudent(student)}
            >
              <Image
                style={gstyles.profilePic100}
                source={{ uri: student.image }}
              />
              <Text style={[gstyles.font18, gstyles.marginTop10]}>
                {student.firstName} {student.lastInitial} ({student.grade})
              </Text>
            </TouchableOpacity>
          );
        }
        // If the student information isn't loaded yet, show a blank view.
        return <View key={student} />
      });
    }

    return (
      <MessageView style={[gstyles.flex1, gstyles.flexStart]}>
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
        {this.state.configurePickup &&
          <View style={styles.configureModal}>
            <KeyboardAwareView
              style={[gstyles.flex1, gstyles.flexStretch, gstyles.flexCenter]}
              centerOnInput
            >
              <TouchableWithoutFeedback
                onPress={this._clearConfigurePickup}
              >
                <BlurView style={[styles.configureModal]} tint="light" intensity={75} />
              </TouchableWithoutFeedback>
              <View style={[styles.dialog, gstyles.flexStart, gstyles.flexStretch]}>
                <View
                  style={[{ height: 44, backgroundColor: colors.buttonBackground, paddingHorizontal: 15, alignItems: 'center' }, gstyles.flexRow, gstyles.flexStretch]}
                >
                  <Text
                    style={[gstyles.font18, gstyles.flex1, { color: 'white' }]}
                  >
                    Configure Pickup
                  </Text>
                  <Icon.Button
                    name="md-close"
                    onPress={this._clearConfigurePickup}
                    style={{ paddingVertical: 0 }}
                    iconStyle={{ marginRight: 0 }}
                    color="white"
                    backgroundColor={colors.buttonBackground}
                  />
                </View>
                <View
                  style={[{ paddingHorizontal: 15, paddingVertical: 10 }, gstyles.flexStretch]}
                >
                  <Text style={[gstyles.flexStretch, gstyles.font18, gstyles.marginTop10]}>
                    Pickup Location:
                  </Text>
                  <Picker
                    style={[gstyles.flexStretch, gstyles.marginTop10]}
                    values={Object.keys(C.Locations)}
                    onChange={this._setLocation}
                    columns={2}
                  />
                  {this.state.showVehicle &&
                    <View style={gstyles.marginTop10}>
                      <Text style={gstyles.font18}>Your Vehicle:</Text>
                      {this.props.user.vehicles.length > 0 &&
                        <Picker
                          style={[gstyles.flexStretch, gstyles.marginTop10]}
                          columns={2}
                          values={this.props.user.vehicles}
                          onChange={vehicle => this.setState({ vehicle, disabled: false })}
                          value={this.state.vehicle}
                        />
                      }
                      <View
                        style={[
                          gstyles.flexStretch,
                          gstyles.flexRow,
                          {
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }
                        ]}
                      >
                        <LinedTextInput
                          style={{ flex: 1, marginRight: 5 }}
                          placeholder="Describe vehicle"
                          autoCapitalize="words"
                          clearButtonMode="while-editing"
                          borderBottomColor={'darkgray'}
                          onChangeText={this._changeAddVehicleText}
                          value={this.state.addVehicleText}
                          onSubmitEditing={Keyboard.dismiss}
                          blurOnSubmit
                          keyboardAwareInput
                        />
                        <Button
                          title="Add"
                          disabled={this.state.disabledAddVehicle}
                          onPress={this._addVehicle}
                        />
                      </View>
                    </View>
                  }
                  <View
                    style={[
                      {
                        marginTop: 20,
                        justifyContent: 'center',
                      },
                      gstyles.flexStretch,
                    ]}
                  >
                    <Button
                      disabled={this.state.disabled}
                      onPress={this._pickup}
                      title="Request Pickup"
                      color={colors.buttonBackground}
                    />
                  </View>
                </View>
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
