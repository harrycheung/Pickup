
// @flow

import { Types } from '../actions/Student';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  students: [],
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
      return {students: action.students};

    case Types.ADD_STUDENT_SUCCEEDED:
      return {students: state.students.concat([action.student])}

    case Types.EDIT_STUDENT_SUCCEEDED:
      return {
        students: state.students.map((student) => {
          if (student.key === action.student.key) {
            return action.student;
          } else {
            return student;
          }
        }),
      };

    case Types.DELETE_STUDENT_SUCCEEDED:
      return {
        students: state.students.filter((student) => {
          return student.key != action.studentKey;
        }),
      };

    case AuthTypes.LOGOUT:
      return {students: []};

    default:
      return state;
  }
}
