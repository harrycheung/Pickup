
// @flow

import { StackNavigator } from 'react-navigation';

import { colors } from '../../../config/styles';
import ManageStudentsScreen from './ManageStudents';
import EditStudentScreen from './EditStudent';
import AddStudentScreen from './AddStudent';

export default StackNavigator({
  ManageStudents: { screen: ManageStudentsScreen },
  EditStudent: { screen: EditStudentScreen },
  AddStudent: { screen: AddStudentScreen },
}, {
  initialRouteName: 'ManageStudents',
  navigationOptions: {
    headerStyle: { backgroundColor: colors.buttonBackground },
    headerTintColor: 'white',
  },
});
