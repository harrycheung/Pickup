
// @flow

import { combineReducers } from 'redux';

import NavReducer from './Navigation';
import AuthReducer from './Auth';
import DataReducer from './Data';

const AppReducer = combineReducers({
  nav: NavReducer,
  auth: AuthReducer,
  data: DataReducer,
});

export default AppReducer;
