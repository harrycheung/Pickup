
// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import ManageStudentsScreen from './ManageStudents';
import EditStudentScreen from './EditStudent';
import AddStudentScreen from './AddStudent';

export default StackNavigator({
  ManageStudents: { screen: ManageStudentsScreen },
  EditStudent: { screen: EditStudentScreen },
  AddStudent: { screen: AddStudentScreen },
}, {
  initialRouteName: 'ManageStudents',
});
