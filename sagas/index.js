
import {
  watchRequestLogin,
  watchLogin,
  watchLogout
} from './Auth';

import {
  watchLoadStudents,
  watchAddStudent,
  watchEditStudent,
  watchDeleteStudent
} from './Student';

import {
  watchLoadUser,
  watchCreateUser,
  watchUpdateUser
} from './User';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield [
    watchRequestLogin(),
    watchLogin(),
    watchLogout(),
    watchLoadStudents(),
    watchAddStudent(),
    watchEditStudent(),
    watchDeleteStudent(),
    watchLoadUser(),
    watchCreateUser(),
    watchUpdateUser()
  ];
}
