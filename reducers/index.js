
// @flow

import { combineReducers } from 'redux';

import NavReducer from './Navigation';
import AuthReducer from './Auth';
import StudentReducer from './Student';
import UserReducer from './User';
import SpinnerReducer from './Spinner';
import PickupReducer from './Pickup';
import MessageReducer from './Message';
import AdminReducer from './Admin';

const AppReducer = combineReducers({
  nav: NavReducer,
  auth: AuthReducer,
  student: StudentReducer,
  user: UserReducer,
  spinner: SpinnerReducer,
  pickup: PickupReducer,
  message: MessageReducer,
  admin: AdminReducer,
});

export default AppReducer;
