import { call, put, takeLatest, select } from 'redux-saga/effects';
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
    const { store: stores } = yield select();
    if (stores[id]) { // 如果书架中有了就不去请求网络
      const tempDetail = stores[id].detail;
      tempDetail.downloadStatus = stores[id].downloadStatus; // 这里主要是做检索的书籍是否已经下载的判断
      yield put({ type: 'search/save', payload: { detail: tempDetail } });
    } else {
      yield put({ type: 'common/save', payload: { loading: true } });
      const data = yield call(readerServices.getDetail, id);
      yield put({ type: 'search/save', payload: { detail: data } });
    }
    yield put({ type: 'reader/save', payload: { downloadPercent: 0 } });
  } catch (error) {
    console.log(error);
  }
  yield put({ type: 'common/save', payload: { loading: false } });
}

export default [
  takeLatest('reader/search', search),
  takeLatest('reader/getDetail', getDetail),
];
