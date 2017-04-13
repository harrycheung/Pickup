
import { loadAuth } from './auth';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield loadAuth();
}
