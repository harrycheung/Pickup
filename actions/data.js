
export const types = {
  LOAD_STUDENTS: 'Data/LOAD_STUDENTS',
  ADD_STUDENT: 'Data/ADD_STUDENT',
  ADD_STUDENT_SUCCEEDED: 'Data/ADD_STUDENT_SUCCEEDED',
  PICKUP: 'Data/PICKUP',
};

export const actions = {
  loadStudents: (students) => ({type: types.LOAD_STUDENTS, students}),
  addStudent: (firstName, lastInitial, relationship) => ({type: types.ADD_STUDENT, firstName, lastInitial, relationship}),
  addStudentSucceeded: (student) => ({type: types.ADD_STUDENT_SUCCEEDED, student}),
  pickup: (students) => ({type: types.PICKUP, students}),
}
