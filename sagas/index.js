
import {
  loadAuth,
  watchRequestLogin,
  watchLogin
} from './auth';

import {
  watchAddStudent,
  watchEditStudent,
  watchDeleteStudent,
  watchPickup
} from './data';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield [
    loadAuth(),
    watchRequestLogin(),
    watchLogin(),
    watchAddStudent(),
    watchEditStudent(),
    watchDeleteStudent(),
    watchPickup(),
  ];
}
