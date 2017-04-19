
import { loadAuth, requestLogin, watchLogin } from './auth';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield [
    loadAuth(),
    requestLogin(),
    watchLogin()
  ];
}
