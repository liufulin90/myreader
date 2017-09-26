import { all } from 'redux-saga/effects';
import common from './common.js';
import reader from './reader.js';
import search from './search.js';

function * rootSaga() {
  yield all([
    ...common,
    ...reader,
    ...search,
  ]);
}

export default rootSaga;
