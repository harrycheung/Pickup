
// @flow

import { Types } from '../actions/Student';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  students: [],
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
      return { students: action.students };

    case Types.EDIT_STUDENT_SUCCEEDED:
      return {
        students: state.students.map((student) => {
          if (student.key === action.student.key) {
            return action.student;
          }

          return student;
        }),
      };

    case Types.UPDATE_RELATIONSHIP: {
      return {
        students: state.students.map((student) => {
          if (action.studentKey === student.key) {
            const updatedStudent = Object.assign({}, student);
            if (action.relationship) {
              updatedStudent.relationships[action.uid] = action.relationship;
            } else {
              delete updatedStudent.relationships[action.uid];
            }
            updatedStudent.relationships = Object.assign({}, updatedStudent.relationships);
            return updatedStudent;
          }
          return student;
        })
      };
    }

    case AuthTypes.LOGOUT:
      return { students: [] };

    default:
      return state;
  }
};
