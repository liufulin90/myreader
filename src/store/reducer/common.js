const initState = {
  logs: ['日志开启'],   // 日志
  currentBookId: '',    // 当前书籍ID
  loading: false,       // 网络请求加载中
};

function common(state = initState, action) {
  switch (action.type) {
    case 'common/save':
      return {
        ...state,
        ...action.payload,
      };
    case 'common/pushLog':
      return {
        ...state,
        ...state.logs.push(action.payload.log),
      };
    default:
      return {
        ...state,
      };
  }
}

export default common;
