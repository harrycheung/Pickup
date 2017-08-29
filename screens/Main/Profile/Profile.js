
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Button, FlatList, Keyboard, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../config/styles';
import drawerHeader from '../../../components/DrawerHeader';
import ProfileForm from '../../../components/ProfileForm';
import MessageView from '../../../components/MessageView';
import LinedTextInput from '../../../components/LinedTextInput';
import IconButton from '../../../components/IconButton';
import { Actions as UserActions } from '../../../actions/User';
import { Actions as ImageActions } from '../../../actions/Image';

class Profile extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Profile',
      drawerLabel: 'Profile',
    })
  );

  constructor(props) {
    super(props);

    this.state = {
      showAddVehicle: false,
      vehicle: '',
    };

    this._addVehicle = this._addVehicle.bind(this);
  }

  state: {
    showAddVehicle: boolean,
    vehicle: string,
  }

  componentWillMount() {
    this.props.setImage(this.props.imageURL);
  }

  _addVehicle() {
    this.props.addVehicle(this.state.vehicle);
    this.setState({ vehicle: '' });
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <ProfileForm
          firstName={this.props.firstName}
          lastInitial={this.props.lastInitial}
          submitButtonText={this.props.firstName === '' ? 'Save' : 'Update'}
          onSubmit={this.props.updateUser}
          spinning={this.props.spinning}
        >
          <View style={[gstyles.flex1, gstyles.marginTop10, gstyles.flexStretch]}>
            <Text style={gstyles.font18}>
              Vehicles:
            </Text>
            <View style={gstyles.flex1}>
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
                  style={{ flex: 3, marginRight: 5 }}
                  placeholder="Describe vehicle"
                  autoCapitalize="words"
                  clearButtonMode="while-editing"
                  borderBottomColor={'darkgray'}
                  onChangeText={text => this.setState({ vehicle: text })}
                  defaultValue=""
                  onSubmitEditing={Keyboard.dismiss}
                  value={this.state.vehicle}
                  keyboardAwareInput
                />
                <Button
                  title="Add"
                  disabled={this.state.vehicle.length < 6}
                  onPress={this._addVehicle}
                />
              </View>
              <FlatList
                style={gstyles.flex1}
                data={this.props.vehicles}
                renderItem={({ item }) => (
                  <View
                    style={[{ marginTop: 5, alignItems: 'center' }, gstyles.flexRow]}
                  >
                    <Text style={[gstyles.font18, { marginRight: 15 }]}>
                      {item}
                    </Text>
                    <IconButton
                      icon="md-trash"
                      onPress={() => this.props.removeVehicle(item)}
                    />
                  </View>
                )}
              />
            </View>
          </View>
        </ProfileForm>
      </MessageView>
    );
  }
}

Profile.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastInitial: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  spinning: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
  vehicles: PropTypes.array.isRequired,
  addVehicle: PropTypes.func.isRequired,
  removeVehicle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  firstName: state.user.firstName,
  lastInitial: state.user.lastInitial,
  imageURL: state.user.image,
  spinning: state.spinner,
  vehicles: state.user.vehicles,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(UserActions, dispatch),
  ...bindActionCreators(ImageActions, dispatch),
});

export default StackNavigator({
  Profile: { screen: connect(mapStateToProps, mapDispatchToProps)(Profile) },
});
