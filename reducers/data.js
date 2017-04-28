
// @flow

import { types } from '../actions/data';

const initialState = {
  students: [],
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case types.LOAD_STUDENTS:
      return {...state, students: action.students};

    case types.ADD_STUDENT_SUCCEEDED:
      return {...state, students: state.students.concat([action.student])}

    case types.EDIT_STUDENT_SUCCEEDED:
      return {...state,
        students: state.students.map((student) => {
          if (student.key == action.student.key) {
            return action.student;
          } else {
            return student;
          }
        }),
      };

    case types.DELETE_STUDENT_SUCCEEDED:
      return {...state,
        students: state.students.filter((student) => {
          return student.key != action.studentKey;
        }),
      };

    default:
      return state;
  }
}
