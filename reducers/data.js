
// @flow

import { Types } from '../actions/Data';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  students: [],
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.LOAD_STUDENTS:
      return {...state, students: action.students};

    case Types.ADD_STUDENT_SUCCEEDED:
      return {...state, students: state.students.concat([action.student])}

    case Types.EDIT_STUDENT_SUCCEEDED:
      return {...state,
        students: state.students.map((student) => {
          if (student.key === action.student.key) {
            return action.student;
          } else {
            return student;
          }
        }),
      };

    case Types.DELETE_STUDENT_SUCCEEDED:
      return {...state,
        students: state.students.filter((student) => {
          return student.key != action.studentKey;
        }),
      };

    case AuthTypes.LOGOUT:
      return {...state, students: []};

    default:
      return state;
  }
}
