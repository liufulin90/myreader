/**
 * Created by liufulin on 17-9-26.
 */
import React from 'react';
import styles from './index.less';
import imgage from './loading.gif';

const Loading = ({ loading }) => {
  return (loading ? (<div className={styles.loading}>
    <img src={imgage} lod={loading} alt="loading" />
  </div>) : (<p />));
};

export default Loading;
