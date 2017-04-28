
// @flow

export const types = {
  LOAD_STUDENTS: 'Data/LOAD_STUDENTS',
  ADD_STUDENT: 'Data/ADD_STUDENT',
  ADD_STUDENT_SUCCEEDED: 'Data/ADD_STUDENT_SUCCEEDED',
  EDIT_STUDENT: 'Data/EDIT_STUDENT',
  EDIT_STUDENT_SUCCEEDED: 'Data/EDIT_STUDENT_SUCCEEDED',
  DELETE_STUDENT: 'Data/DELETE_STUDENT',
  DELETE_STUDENT_SUCCEEDED: 'Data/DELETE_STUDENT_SUCCEEDED',
  PICKUP: 'Data/PICKUP',
};

export const actions = {
  loadStudents: (students: Object[]) => ({
    type: types.LOAD_STUDENTS, students
  }),
  addStudent: (firstName: string , lastInitial: string, grade: string, relationship: string) => ({
    type: types.ADD_STUDENT, firstName, lastInitial, grade, relationship
  }),
  addStudentSucceeded: (student: Object) => ({
    type: types.ADD_STUDENT_SUCCEEDED, student
  }),
  editStudent: (student: Object) => ({
    type: types.EDIT_STUDENT, student
  }),
  editStudentSucceeded: (student: Object) => ({
    type: types.EDIT_STUDENT_SUCCEEDED, student
  }),
  deleteStudent: (studentKey: string) => ({
    type: types.DELETE_STUDENT, studentKey
  }),
  deleteStudentSucceeded: (studentKey: string) => ({
    type: types.DELETE_STUDENT_SUCCEEDED, studentKey
  }),
  pickup: (students: Object[]) => ({
    type: types.PICKUP, students
  }),
}
