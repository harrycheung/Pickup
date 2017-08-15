
// @flow

export const Types = {
  SET: 'Student/SET',
  ADD_STUDENT: 'Student/ADD_STUDENT',
  EDIT_STUDENT: 'Student/EDIT_STUDENT',
  EDIT_STUDENT_SUCCEEDED: 'Student/EDIT_STUDENT_SUCCEEDED',
  DELETE_STUDENT: 'Student/DELETE_STUDENT',
  ADD_RELATIONSHIP: 'Student/ADD_RELATIONSHIP',
  REMOVE_RELATIONSHIP: 'Student/REMOVE_RELATIONSHIP',
  UPDATE_RELATIONSHIP: 'Student/UPDATE_RELATIONSHIP',
  LISTEN_STUDENTS: 'Student/LISTEN_STUDENTS',
  UNLISTEN_STUDENTS: 'Student/UNLISTEN_STUDENTS',
};

export const Actions = {
  setStudents: (students: Object[]) => ({ type: Types.SET, students }),
  addStudent: (firstName: string, lastInitial: string, imageURL: string, grade: string, relationship: string) => ({
    type: Types.ADD_STUDENT, firstName, lastInitial, image: imageURL, grade, relationship,
  }),
  editStudent: (student: Object) => ({
    type: Types.EDIT_STUDENT, student,
  }),
  editStudentSucceeded: (student: Object) => ({
    type: Types.EDIT_STUDENT_SUCCEEDED, student,
  }),
  deleteStudent: (studentKey: string) => ({
    type: Types.DELETE_STUDENT, studentKey,
  }),
  addRelationship: (studentKey: string, uid: string, relationship: string) => ({
    type: Types.ADD_RELATIONSHIP, studentKey, uid, relationship,
  }),
  removeRelationship: (studentKey: string, uid: string) => ({
    type: Types.REMOVE_RELATIONSHIP, studentKey, uid,
  }),
  updateRelationship: (studentKey: string, uid: string, relationship: Object) => ({
    type: Types.UPDATE_RELATIONSHIP, studentKey, uid, relationship,
  }),
  listenStudents: (uid: string) => ({ type: Types.LISTEN_STUDENTS, uid }),
  unlistenStudents: () => ({ type: Types.UNLISTEN_STUDENTS }),
};
