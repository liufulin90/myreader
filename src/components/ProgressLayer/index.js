/**
 * Created by liufulin on 17-9-26.
 * 进度条
 */
import React from 'react';
import styles from './index.less';

const ProgressLayer = ({ length }) => {
  const widths = `${length}%`;
  return (<div className={styles.progressBody}>
    <div className={styles.progress} style={{ width: widths }} >&nbsp;</div>
  </div>);
};

export default ProgressLayer;
