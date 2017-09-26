import { call, put, takeLatest } from 'redux-saga/effects';
import * as readerServices from '../../services/reader.js';

function* search({ query }) {
  try {
    yield put({ type: 'common/save', payload: { loading: true } });
    const data = yield call(readerServices.search, query.query);
    yield put({ type: 'search/save', payload: { list: data.books || [], status: data.ok || true } });
  } catch (error) {
    console.log(error);
  }
  yield put({ type: 'common/save', payload: { loading: false } });
}

function* getDetail({ query }) {
  try {
    const { id } = query;
    yield put({ type: 'common/save', payload: { loading: true } });
    const data = yield call(readerServices.getDetail, id);
    yield put({ type: 'search/save', payload: { detail: data } });
  } catch (error) {
    console.log(error);
  }
  yield put({ type: 'common/save', payload: { loading: false } });
}

export default [
  takeLatest('reader/search', search),
  takeLatest('reader/getDetail', getDetail),
];
