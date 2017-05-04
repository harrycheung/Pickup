
// @flow

import { combineReducers } from 'redux';

import NavReducer from './Navigation';
import AuthReducer from './Auth';
import DataReducer from './Data';
import PickupReducer from './Pickup';
import UserReducer from './User';
import SpinnerReducer from './Spinner';

const AppReducer = combineReducers({
  nav: NavReducer,
  auth: AuthReducer,
  data: DataReducer,
  pickup: PickupReducer,
  user: UserReducer,
  spinner: SpinnerReducer,
});

export default AppReducer;
