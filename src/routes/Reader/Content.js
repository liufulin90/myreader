import React from 'react';
import styles from './Content.less';

// 将换行符作为依据转换成数组显示，这样方便设置css样式。
export default ({ content, style }) => (<div className={styles.content} style={style}>
  { content && content.split('\n').map(i => <p>{i}</p>) }
</div>);
