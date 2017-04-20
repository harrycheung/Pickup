
import { types } from '../actions/data';

const initialState = {
  students: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_STUDENTS:
      return {...state, students: action.students};

    case types.ADD_STUDENT_SUCCEEDED:
      return {...state, students: state.students.concat([action.student])}

    default:
      return state;
  }
}
