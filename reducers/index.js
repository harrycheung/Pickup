
// @flow

import { combineReducers } from 'redux';

import NavReducer from './Navigation';
import AuthReducer from './Auth';
import DataReducer from './Data';
import PickupReducer from './Pickup';

const AppReducer = combineReducers({
  nav: NavReducer,
  auth: AuthReducer,
  data: DataReducer,
  pickup: PickupReducer,
});

export default AppReducer;
