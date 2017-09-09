
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { colors, gstyles } from '../../config/styles';
import Button from '../../components/Button';
import CachedImage from '../../components/CachedImage';
import PickupScreen from './Pickup';
import StudentsScreen from './Students';
import LogoutScreen from './Logout';
import ProfileScreen from './Profile';
import AdminScreen from './Admin';
import { Actions as NavActions } from '../../actions/Navigation';

const Drawer = (props) => {
  const drawerProps = update(props, { items: { $set:
    props.items.filter(route => !route.key.includes('Admin')),
  } });
  return (
    <View style={gstyles.flex1}>
      <View
        style={{
          backgroundColor: colors.buttonBackground,
          padding: 20,
          paddingTop: 40,
          alignItems: 'center',
        }}
      >
        <CachedImage
          style={[gstyles.profilePic100, { backgroundColor: 'transparent' }]}
          source={{ uri: props.image }}
        />
      </View>
      <View style={gstyles.flex1}>
        <DrawerItems
          {...drawerProps}
        />
      </View>
      {props.admin &&
        <Button
          style={{ margin: 15 }}
          content="Admin"
          round
          onPress={() => props.navigate('Admin')}
        />
      }
    </View>
  );
};

Drawer.propTypes = {
  admin: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  admin: state.user.admin,
  image: state.user.image,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default DrawerNavigator({
  Pickup: { screen: PickupScreen },
  Students: { screen: StudentsScreen },
  Profile: { screen: ProfileScreen },
  Logout: { screen: LogoutScreen },
  Admin: { screen: AdminScreen },
}, {
  drawerWidth: 200,
  order: ['Pickup', 'Students', 'Profile', 'Logout', 'Admin'],
  contentComponent: connect(mapStateToProps, mapDispatchToProps)(Drawer),
  headerMode: 'none',
});
