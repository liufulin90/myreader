const initState = {
  status: false,  // 获取书籍列表返回状态值
  list: [],   // 列表
  detail: {},   // 书籍详情
};

function search(state = initState, action) {
  switch (action.type) {
    case 'search/save':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return {
        ...state,
      };
  }
}

export default search;
