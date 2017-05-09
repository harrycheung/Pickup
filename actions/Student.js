
// @flow

export const Types = {
  LOAD: 'Student/LOAD',
  LOADED: 'Student/LOADED',
  SET: 'Student/SET',
  ADD_STUDENT: 'Student/ADD_STUDENT',
  ADD_STUDENT_SUCCEEDED: 'Student/ADD_STUDENT_SUCCEEDED',
  EDIT_STUDENT: 'Student/EDIT_STUDENT',
  EDIT_STUDENT_SUCCEEDED: 'Student/EDIT_STUDENT_SUCCEEDED',
  DELETE_STUDENT: 'Student/DELETE_STUDENT',
  DELETE_STUDENT_SUCCEEDED: 'Student/DELETE_STUDENT_SUCCEEDED',
};

export const Actions = {
  loadStudents: (uid: string) => ({type: Types.LOAD, uid}),
  loadedStudents: () => ({type: Types.LOADED}),
  setStudents: (students: Object[]) => ({type: Types.SET, students}),
  addStudent: (firstName: string , lastInitial: string, grade: string, relationship: string) => ({
    type: Types.ADD_STUDENT, firstName, lastInitial, grade, relationship
  }),
  addStudentSucceeded: (student: Object) => ({
    type: Types.ADD_STUDENT_SUCCEEDED, student
  }),
  editStudent: (student: Object) => ({type: Types.EDIT_STUDENT, student}),
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
