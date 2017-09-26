import { put, takeLatest } from 'redux-saga/effects';

function* changeLoading({ query }) {
  try {
    yield put({ type: 'common/save', payload: { loading: query.loading || false } });
  } catch (error) {
    console.log(error);
  }
}

export default [
  takeLatest('common/loading', changeLoading),
];
