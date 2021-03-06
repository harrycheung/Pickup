
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { colors, gstyles } from '../../config/styles';
import { isIPhoneX } from '../../helpers';
import Button from '../../components/Button';
import CachedImage from '../../components/CachedImage';
import PickupScreen from './Pickup';
import StudentsScreen from './Students';
import LogoutScreen from './Logout';
import ProfileScreen from './Profile';
import AdminScreen from './Admin';
import SearchStudentsScreen from './SearchStudents';
import { Actions as NavActions } from '../../actions/Navigation';

const Drawer = (props) => {
  const drawerProps = update(props, { items: { $set:
    props.items.filter(route =>
      !['Logout', 'Admin', 'SearchStudents'].includes(route.key) ||
      (props.admin && !['Logout'].includes(route.key)),
    ),
  } });
  return (
    <View style={gstyles.flex1}>
      <View
        style={{
          backgroundColor: colors.buttonBackground,
          padding: 20,
          paddingTop: 10,
          alignItems: 'center',
        }}
      >
        <Image
          style={{
            width: 150,
            height: 75,
            marginBottom: 10,
            marginTop: isIPhoneX() ? 22 : 0,
          }}
          source={require('../../images/logo.png')}
        />
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
      <View>
        <Button
          style={{ margin: 15, marginBottom: 15 + (isIPhoneX() ? 25 : 0)  }}
          content="Logout"
          round
          onPress={() => props.navigate('Logout')}
        />
      </View>
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
  SearchStudents: { screen: SearchStudentsScreen },
}, {
  drawerWidth: 200,
  order: ['Pickup', 'Students', 'Profile', 'Logout', 'Admin', 'SearchStudents'],
  contentComponent: connect(mapStateToProps, mapDispatchToProps)(Drawer),
  headerMode: 'none',
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
});
