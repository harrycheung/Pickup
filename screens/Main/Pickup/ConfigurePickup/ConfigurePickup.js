
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Keyboard,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as C from '../../../../config/constants';
import { colors, gstyles } from '../../../../config/styles';
import MyButton from '../../../../components/Button';
import MessageView from '../../../../components/MessageView';
import Picker from '../../../../components/Picker';
import LinedTextInput from '../../../../components/LinedTextInput';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as UserActions } from '../../../../actions/User';

class ConfigurePickup extends React.Component {
  static navigationOptions = {
    title: 'Configure Pickup',
  };

  constructor(props) {
    super(props);

    this.state = {
      showVehicle: false,
      addVehicleText: '',
      location: '',
      vehicle: '',
      disabled: true,
      disabledAddVehicle: true,
    };

    this._pickup = this._pickup.bind(this);
    this._addVehicle = this._addVehicle.bind(this);
    this._setLocation = this._setLocation.bind(this);
    this._changeAddVehicleText = this._changeAddVehicleText.bind(this);
  }

  state: {
    students: Object[],
    showVehicle: boolean,
    addVehicleText: string,
    location: string,
    vehicle: string,
    disabled: boolean,
    disabledAddVehicle: boolean,
  }

  vehiclePicker: Object
  vehicleInput: Object

  _pickup() {
    this.props.createPickup(
      this.props.user,
      this.props.navigation.state.params.students,
      this.state.location,
      this.state.vehicle,
      this.props.navigation.state.key,
    );
    this._clearConfigurePickup();
  }

  _addVehicle() {
    const vehicle = this.state.addVehicleText;
    this.props.addVehicle(vehicle);
    this.setState({
      vehicle,
      addVehicleText: '',
      disabledAddVehicle: true,
      disabled: false,
    });
    Keyboard.dismiss();
  }

  _clearConfigurePickup() {
    this.setState({
      students: [],
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
      disabled: location !== 'Playground' && this.state.vehicle === '',
      vehicle: location === 'Playground' ? '' : this.state.vehicle,
      disabledAddVehicle: location === 'Playground' ? true : this.state.disabledAddVehicle,
      addVehicleText: location === 'Playground' ? '' : this.state.addVehicleText,
    });
  }

  _changeAddVehicleText(text) {
    this.setState({
      addVehicleText: text,
      disabledAddVehicle: text.length < 6 || this.props.user.vehicles.indexOf(text) > -1,
    });
  }

  render() {
    return (
      <MessageView style={[gstyles.flex1, gstyles.flexStart]}>
        <KeyboardAwareView
          style={[{ paddingHorizontal: 15, paddingVertical: 10 }, gstyles.flexStretch]}
          centerOnInput
        >
          <Text style={[gstyles.flexStretch, gstyles.font18, gstyles.marginTop10]}>
            Pickup Location:
          </Text>
          <Picker
            style={[gstyles.flexStretch, gstyles.marginTop10]}
            values={Object.keys(C.Locations)}
            onChange={this._setLocation}
            columns={2}
            value={this.state.location}
          />
          {this.state.showVehicle &&
            <View style={gstyles.marginTop10}>
              <Text style={gstyles.font18}>Your Vehicle:</Text>
              {this.props.user.vehicles.length > 0 &&
                <Picker
                  ref={(picker) => { this.vehiclePicker = picker; }}
                  style={[gstyles.flexStretch, gstyles.marginTop10]}
                  columns={2}
                  values={this.props.user.vehicles}
                  onChange={(vehicle) => {
                    this.setState({
                      vehicle,
                      disabled: false,
                      addVehicleText: '',
                      disabledAddVehicle: true,
                    });
                    this.vehicleInput.blur();
                  }}
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
                  },
                ]}
              >
                <LinedTextInput
                  ref={(input) => { this.vehicleInput = input; }}
                  style={{ flex: 1, marginRight: 5 }}
                  placeholder="Describe vehicle"
                  autoCapitalize="words"
                  clearButtonMode="while-editing"
                  borderBottomColor={'darkgray'}
                  onChangeText={this._changeAddVehicleText}
                  value={this.state.addVehicleText}
                  onSubmitEditing={Keyboard.dismiss}
                  onFocus={() => {
                    this.setState({ vehicle: '', disabled: true });
                  }}
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
          <MyButton
            style={[{ marginTop: 20 }, gstyles.flexStretch]}
            disabled={this.state.disabled}
            onPress={this._pickup}
            content="Request Pickup"
            color={colors.buttonBackground}
            round
          />
        </KeyboardAwareView>
      </MessageView>
    );
  }
}

ConfigurePickup.propTypes = {
  user: PropTypes.object.isRequired,
  createPickup: PropTypes.func.isRequired,
  addVehicle: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(UserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurePickup);
