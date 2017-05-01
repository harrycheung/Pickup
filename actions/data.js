
// @flow

export const Types = {
  LOAD_STUDENTS: 'Data/LOAD_STUDENTS',
  ADD_STUDENT: 'Data/ADD_STUDENT',
  ADD_STUDENT_SUCCEEDED: 'Data/ADD_STUDENT_SUCCEEDED',
  EDIT_STUDENT: 'Data/EDIT_STUDENT',
  EDIT_STUDENT_SUCCEEDED: 'Data/EDIT_STUDENT_SUCCEEDED',
  DELETE_STUDENT: 'Data/DELETE_STUDENT',
  DELETE_STUDENT_SUCCEEDED: 'Data/DELETE_STUDENT_SUCCEEDED',
};

export const Actions = {
  loadStudents: (students: Object[]) => ({
    type: Types.LOAD_STUDENTS, students
  }),
  addStudent: (firstName: string , lastInitial: string, grade: string, relationship: string) => ({
    type: Types.ADD_STUDENT, firstName, lastInitial, grade, relationship
  }),
  addStudentSucceeded: (student: Object) => ({
    type: Types.ADD_STUDENT_SUCCEEDED, student
  }),
  editStudent: (student: Object) => ({
    type: Types.EDIT_STUDENT, student
  }),
  editStudentSucceeded: (student: Object) => ({
    type: Types.EDIT_STUDENT_SUCCEEDED, student
  }),
  deleteStudent: (studentKey: string) => ({
    type: Types.DELETE_STUDENT, studentKey
  }),
  deleteStudentSucceeded: (studentKey: string) => ({
    type: Types.DELETE_STUDENT_SUCCEEDED, studentKey
  })
}
