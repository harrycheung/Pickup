
import {
  watchRequestLogin,
  watchLogin,
  watchLogout
} from './Auth';

import {
  watchAddStudent,
  watchEditStudent,
  watchDeleteStudent
} from './Data';

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
    watchAddStudent(),
    watchEditStudent(),
    watchDeleteStudent(),
    watchPickup(),
    watchLoadUser(),
    watchCreateUser(),
    watchUpdateUser()
  ];
}
