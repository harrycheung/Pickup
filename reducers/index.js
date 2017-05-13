
// @flow

import { combineReducers } from 'redux';

import NavReducer from './Navigation';
import AuthReducer from './Auth';
import StudentReducer from './Student';
import UserReducer from './User';
import SpinnerReducer from './Spinner';

const AppReducer = combineReducers({
  nav: NavReducer,
  auth: AuthReducer,
  student: StudentReducer,
  user: UserReducer,
  spinner: SpinnerReducer,
});

export default AppReducer;
