
import { types } from '../actions/data';

const initialState = {
  students: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_STUDENTS:
      return {...state, students: action.students};

    default:
      return state;
  }
}
