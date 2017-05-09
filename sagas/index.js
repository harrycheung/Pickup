
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
  watchPickup
} from './Pickup';

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
    watchPickup(),
    watchLoadUser(),
    watchCreateUser(),
    watchUpdateUser()
  ];
}
