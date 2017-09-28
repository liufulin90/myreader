import { call, put, select, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import * as readerServices from '../../services/reader.js';
// import { log } from '../../utils/common.js';

// console.log = log;

/**
 * 获取书源
 * @param query
 */
function* getSource({ query }) {
  try {
    const { id } = query;
    // 这里获得整个缓存中的store，并对应上reader的store。其reader的store结构参考store/reducer/reader.js initState
    const { reader: { id: currentId, detail: { title } } } = yield select();
    if (currentId) {
      if (id !== currentId) {
        const { reader, store: { [id]: book } } = yield select();
        console.log(`将《${title}》放回书架`);
        yield put({ type: 'store/put', payload: { ...reader }, key: currentId });
        yield put({ type: 'reader/clear' });
        if (book && book.detail && book.source) {
          console.log(`从书架取回《${book.detail.title}》`);
          yield put({ type: 'reader/save', payload: { ...book } });
          return;
        }
      } else {
        return;
      }
    }
    let { search: { detail } } = yield select();
    yield put({ type: 'common/save', payload: { loading: true } });
    if (!detail._id) {
      console.log('详情不存在，前往获取');
      detail = yield call(readerServices.getDetail, id);
    }
    const data = yield call(readerServices.getSource, id);
    console.log(`从网络获取《${detail.title}》`);
    yield put({ type: 'reader/save', payload: { source: data, id, detail } });
    console.log(`阅读：${detail.title}`);
    yield getChapterList();
  } catch (error) {
    console.log(error);
  }
  yield put({ type: 'common/save', payload: { loading: false } });
}

/**
 * 章节列表
 */
function* getChapterList() {
  try {
    const { reader: { source, currentSource } } = yield select();
    console.log('获取章节列表', currentSource, source.length, JSON.stringify(source));
    if (currentSource >= source.length) {
      console.log('走到这里说明所有书源都已经切换完了');
      yield put({ type: 'reader/save', payload: { currentSource: 0 } });
      yield getChapterList();
      return;
    }
    const { _id, name = '未知来源' } = source[currentSource];
    console.log(`书源: ${name}`);
    const { chapters } = yield call(readerServices.getChapterList, _id);
    yield put({ type: 'reader/save', payload: { chapters } });
    yield getChapter();
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取章节内容
 */
function* getChapter() {
  try {
    const { reader: { chapters, currentChapter,
      downloadStatus, chaptersContent } } = yield select();

    if (downloadStatus) { // 已下载
      const chapter = chaptersContent[currentChapter || 0];
      console.log(`章节: ${chapter.title}`);
      yield put({ type: 'reader/save', payload: { chapter } });
      window.scrollTo(0, 0);
    } else {
      const { link } = chapters[currentChapter || 0];
      yield put({ type: 'common/save', payload: { loading: true } });
      const { chapter } = yield call(readerServices.getChapter, link);
      if (chapter) {
        console.log(`章节: ${chapter.title}`);
        yield put({ type: 'reader/save', payload: { chapter } });
        window.scrollTo(0, 0);
      } else {
        console.log('章节获取失败');
        yield getNextSource();
      }
    }
  } catch (error) {
    console.log(error);
  }
  yield put({ type: 'common/save', payload: { loading: false } });
}

/**
 * 跳转至章节内容
 * @param payload
 */
function* goToChapter({ payload }) {
  try {
    const { reader: { chapters } } = yield select();
    const nextChapter = payload.nextChapter;
    if (nextChapter > chapters.length) {
      console.log('没有下一章啦');
      return;
    }
    if (nextChapter < 0) {
      console.log('没有上一章啦');
      return;
    }
    yield put({ type: 'reader/save', payload: { currentChapter: nextChapter } });
    yield getChapter();
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取下一个书源。
 * 在获取书源后无法获取 具体章节 便会获取下一个书源。直到所有书源换完为止
 */
function* getNextSource() {
  try {
    const { reader: { source, currentSource } } = yield select();
    let nextSource = (currentSource || 1) + 1;
    console.log(`开始第${nextSource}个书源`);
    if (nextSource >= source.length) {
      console.log('没有可用书源,切换回优质书源');
      nextSource = 0;
    }
    console.log(`正在尝试切换到书源: ${source[nextSource] && source[nextSource].name}`);
    yield put({ type: 'reader/save', payload: { currentSource: nextSource } });
    yield getChapterList();
  } catch (error) {
    console.log(error);
  }
}

function* reStore({ payload }) {
  try {
    const { reader, store, setting } = payload;
    yield put({ type: 'reader/save', payload: { ...reader } });
    yield put({ type: 'store/save', payload: { ...store } });
    yield put({ type: 'setting/save', payload: { ...setting } });
  } catch (error) {
    console.log(error);
  }
}

function* changeMenu({ payload }) {
  yield put({ type: 'reader/save', payload: { menuState: payload.menuState } });
}

/**
 * 根据书籍id查询书架中(是否有该书籍 以及 是否已下载)
 *
 * @param storeId
 * @returns {{has: boolean, downloadStatus: boolean}}
 */
function* findBookByStoreId(storeId) {
  const { store: stores } = yield select();
  for (const key in stores) {
    if (Object.prototype.hasOwnProperty.call(stores, key)) { // 过滤
      console.log('循环查找书籍，key=', stores && stores[key]);
      if (stores[key] && stores[key].id === storeId) {
        if (stores[key].downloadStatus) { // 书架中有书且已下载
          return {
            has: true,
            downloadStatus: true,
          };
        } else { // 书架中有书，但是没有下载
          return {
            has: true,
            downloadStatus: false,
          };
        }
      }
    }
  }
  return {
    has: false,
    downloadStatus: false,
  };
}
/**
 * 离线下载书籍 获取书源
 * @param query
 */
function* downGetSource({ query }) {
  try {
    const { id, download } = query;
    // 这里获得整个缓存中的store，并对应上reader的store。其reader的store结构参考store/reducer/reader.js initState
    // 同时获取该书是否下载的状态
    const { reader: { id: currentId, detail: { title } } } = yield select();
    console.log(`当前书信息currentId:${currentId} , id:${id}, title:${title}`);
    if (download) {
      const judgeRet = yield findBookByStoreId(id);
      console.log('判断返回的结果：', judgeRet);
      if (judgeRet.has && judgeRet.downloadStatus) {
        console.log('已下载,直接阅读');
        yield put({ type: 'reader/save', payload: { downloadStatus: true } });
        return;
      }

      yield put({ type: 'common/save', payload: { loading: true } });
      let { search: { detail } } = yield select();
      if (!detail._id) {
        console.log('下载时详情不存在，前往获取');
        detail = yield call(readerServices.getDetail, id);
      }
      // 获得的所有书源
      const sourceList = yield call(readerServices.getSource, id);
      let sourceIndex = 0; // 标记书源当前脚标
      let chapterList = []; // 初始化可用章节列表
      // 循环获得一个可用的书源，达到自动换源的效果
      for (let i = 0, len = sourceList.length; i < len; i += 1) {
        if (sourceList[i].name !== '优质书源') {
          const { chapters } = yield call(readerServices.getChapterList, sourceList[i]._id);
          if (chapters.length) {
            const { chapter, ok } = yield call(readerServices.getChapter, chapters[i].link);
            if (ok && chapter) {
              console.log(`成功获取一个书源 index: ${sourceIndex} 章节总数 ${chapters.length}`);
              console.log('要下载的书源', sourceList[sourceIndex]);
              // 成功获取一个书源，并将相关信息先存下来
              yield put({ type: 'reader/save', payload: { source: sourceList, id, detail, chapters, chapter, downloadPercent: 0, currentSource: sourceIndex, currentChapter: 0 } });
              chapterList = chapters;
              break;
            }
          }
        }
        sourceIndex += 1;
      }
      // 开始循环章节获得章节内容，并保存在本地
      const chaptersContent = []; // 章节列表及其内容
      for (let i = 0, len = chapterList.length; i < len; i += 1) {
        const { chapter } = yield call(readerServices.getChapter, chapterList[i].link);
        chaptersContent[i] = chapter;
        // 添加下载进度
        yield put({ type: 'reader/save', payload: { downloadPercent: (i / len) * 100 } });
      }
      // 取消下载进度
      yield put({ type: 'reader/save', payload: { downloadPercent: 0 } });

      console.log('保存的章节内容', chaptersContent);
      yield put({ type: 'reader/save', payload: { chaptersContent } });

      // 没有下载
      if (!judgeRet.downloadStatus) {
        const { reader, store: { [id]: book }, search: { detail: searchDetail } } = yield select();
        reader.downloadStatus = true; // 设定已下载
        console.log('将书籍存入书架');
        yield put({ type: 'store/put', payload: { ...reader }, key: id });
        yield put({ type: 'reader/clear' });
        if (book && book.detail && book.source) { // 如果原书架中有对应的书则取出，否则用当前的书
          console.log(`从书架取回《${book.detail.title}》`);
          yield put({ type: 'reader/save', payload: { ...book } });
        } else {
          console.log('原书架没书，用当前书');
          yield put({ type: 'reader/save', payload: { ...reader } });
        }
        searchDetail.downloadStatus = true;
        yield put({ type: 'search/save', payload: { searchDetail } });
      }
    }
  } catch (error) {
    console.log(error);
  }
  yield put({ type: 'common/save', payload: { loading: false } });
}

export default [
  takeLatest(REHYDRATE, reStore),
  takeLatest('reader/downGetSource', downGetSource),
  takeLatest('reader/getSource', getSource),
  takeLatest('reader/getChapterList', getChapterList),
  takeLatest('reader/getChapter', getChapter),
  takeLatest('reader/goToChapter', goToChapter),
  takeLatest('reader/changeMenu', changeMenu),
];
