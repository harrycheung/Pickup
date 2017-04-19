
export const types = {
  LOAD_STUDENTS: 'Data/LOAD_STUDENTS',
};

export const actions = {
  loadStudents: (students) => ({type: types.LOAD_STUDENTS, students}),
}
