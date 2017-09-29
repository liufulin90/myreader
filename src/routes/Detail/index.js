import React, { Component } from 'react';
import { connect } from 'react-redux';
import GaussianBlur from '../../components/GaussianBlur';

import styles from './index.less';
// import BackIcon from './back.svg';
import ProgressLayer from '../../components/ProgressLayer';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.readNow = (id) => {
      this.props.history.push(`/reader/${id}`);
      this.props.dispatch({
        type: 'reader/getSource',
        query: { id },
      });
    };
    this.back = () => {
      this.props.history.goBack();
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'reader/getDetail',
      query: this.props.match.params,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { downloadStatus, _id } = nextProps;
    // 下载完成或当前书籍已经下载到书架中则跳转页面到阅读页
    if (downloadStatus) {
      this.readNow(_id);
    }
  }

  /**
   * 离线下载
   * @param id
   */
  downloadNow = () => {
    const { _id } = this.props;
    this.props.dispatch({
      type: 'reader/downGetSource',
      query: { id: _id, download: true },
    });
  }
  render() {
    const {
      _id,
      cover,
      title,
      author,
      isSerial,
      majorCate,
      minorCate,
      longIntro,
      wordCount,
      latelyFollower,
      lastChapter,
      tags,
      downloadStatus,
      downloadPercent,
    } = this.props;
    return (<div>
      <GaussianBlur filter={50} src={cover}>
        <span className={styles.back} onClick={this.back}>
          <span>返回</span>
        </span>
        <div className={styles.book}>
          <img className={styles.cover} src={cover} alt="" />
          <div className={styles.info}>
            <h1>{title}</h1>
            <p>{author}</p>
            <p>{majorCate} / {minorCate}</p>
            <p className={styles.meta}>{wordCount > 10000 ? `${parseInt(wordCount / 10000, 0)} 万` : wordCount}字、{latelyFollower} 人在追</p>
            <p>{isSerial ? '连载中' : '已完结'}</p>
          </div>
        </div>
      </GaussianBlur>
      <div className={styles.body}>
        <p className={styles.desc}>{longIntro && longIntro.length > 40 ? `${longIntro.substring(0, 40)}...` : longIntro}</p>
        <div className={styles.tags}>
          {
            tags && tags.map(i =>
              (<span key={i}>
                {i}
              </span>))
          }
        </div>
        <p className={styles.last}>最新章节：{lastChapter}</p>
        <a className={styles.read} onClick={this.readNow.bind(this, _id)}>立即阅读</a>
        <a className={styles.download} onClick={this.downloadNow}>{!downloadStatus ? '离线下载' : '已下载'}</a>
      </div>
      {
        downloadPercent > 1 ? (<div className={styles.progressWrap}><ProgressLayer length={downloadPercent || 1} /></div>) : ''
      }
    </div>);
  }
}

function mapStateToProps(state) {
  const { detail = {} } = state.search;
  const { downloadPercent } = state.reader;
  return {
    ...detail,
    downloadPercent,
  };
}

export default connect(mapStateToProps)(Detail);
