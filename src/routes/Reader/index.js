import React, { Component } from 'react';
import { connect } from 'react-redux';
import Head from './Head';
import Content from './Content';
import Loading from './Loading';
import Setting from './Setting';

import styles from './index.less';

class Search extends Component {
  constructor(props) {
    super(props);
    this.next = () => {
      const { currentChapter, chapters } = this.props;
      const page = currentChapter + 1;
      const chaptersLen = chapters.length;
      if (page === chaptersLen) {
        return;
      }
      this.goToChapter(page);
    };
    this.prev = () => {
      const { currentChapter } = this.props;
      if (currentChapter <= 0) {
        return;
      }
      this.goToChapter(currentChapter - 1);
    };
    this.goToChapter = (nextChapter) => {
      this.props.dispatch({
        type: 'reader/goToChapter',
        payload: { nextChapter },
      });
    };
    this.goToChapters = () => {
      this.props.history.push('/cps');
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'reader/getSource',
      query: this.props.match.params,
    });
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /**
   * 普通的menu，显示在内容底部
   * @returns {XML}
   */
  optionsMenuNormal = () => {
    const {
      style,
      mode,
      dispatch,
    } = this.props;

    return (<div style={{
      padding: 20,
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: 10,
      borderTop: '1px dashed rgba(0, 0,0, 0.1)',
    }}
    >
      <Setting
        mode={mode}
        style={style}
        dispatch={dispatch}
      >
        <span>设置</span>
      </Setting>
      <span onClick={this.goToChapters}>章节列表</span>
      <span onClick={this.prev}>上一章</span>
      <span onClick={this.next}>下一章</span>
    </div>);
  }

  /**
   * 悬浮的menu，点击伸缩展开
   * @returns {XML}
   */
  optionsMenuFixed = () => {
    const {
      style,
      mode,
      dispatch,
      menuState,
      currentChapter,
      chapters,
    } = this.props;
    return (<div
      className={styles.fixedMenu}
    >
      <div
        className={menuState ? styles.btnMain : styles.btnMainClose}
        onClick={this.changeMenu}
      >+
      </div>
      <div className={menuState ? styles.ballWrap : styles.ballWrapClose}>
        <span onClick={this.goToChapters} className={styles.ball}>章节列表</span>
        <span
          onClick={this.prev}
          className={currentChapter < 1 ? styles.ballPreOff : styles.ballPreOn}
        >上一章</span>
        <span
          onClick={this.next}
          className={currentChapter >= chapters.length - 1 ? styles.ballNextOff : styles.ballNextOn}
        >下一章</span>
        <Setting
          mode={mode}
          style={style}
          dispatch={dispatch}
          className={styles.ball}
        >
          <span className={styles.ball}>设置</span>
        </Setting>
      </div>
    </div>);
  }
  /**
   * 点击展开关闭菜单
   */
  changeMenu = () => {
    const { menuState } = this.props;
    this.props.dispatch({
      type: 'reader/changeMenu',
      payload: { menuState: !menuState },
    });
  }

  render() {
    const {
      chapter = {},
      detail = {},
      logs = [],
      color = {},
      style,
      // mode,
      history,
      // dispatch,
    } = this.props;
    return (<div className={styles.reader} style={color}>
      {
        chapter.title ? <div>
          <Head title={chapter.title} bookName={detail.title} history={history} color={color} />
          <Content style={style} content={chapter.body} />

          {this.optionsMenuFixed()}

        </div> : <Loading logs={logs} />
      }
    </div>);
  }
}

function mapStateToProps(state) {
  const { chapter, chapters, currentChapter = 0, detail, menuState } = state.reader;
  const { logs } = state.common;
  return {
    logs,
    chapter,
    chapters,
    detail,
    currentChapter,
    menuState,
    ...state.setting,
  };
}

export default connect(mapStateToProps)(Search);
