const initState = {
  status: false,  // 获取书籍列表返回状态值 true: 检索列表不清空  false：检索列表清空
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
