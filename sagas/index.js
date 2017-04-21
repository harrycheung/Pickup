
import { loadAuth, requestLogin, watchLogin } from './auth';
import { watchAddStudent, watchPickup } from './data';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield [
    loadAuth(),
    requestLogin(),
    watchLogin(),
    watchAddStudent(),
    watchPickup(),
  ];
}
