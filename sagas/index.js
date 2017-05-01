
import {
  loadAuth,
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

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield [
    loadAuth(),
    watchRequestLogin(),
    watchLogin(),
    watchLogout(),
    watchAddStudent(),
    watchEditStudent(),
    watchDeleteStudent(),
    watchPickup()
  ];
}
