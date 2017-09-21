
function store(state = {}, action) {
  switch (action.type) {
    case 'store/put': { // 将书籍放入书架
      if (action.key) {
        return {
          ...state,
          [action.key]: {
            ...state[action.key],
            ...action.payload,
          },
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case 'store/save': // 初始化书架
      return {
        ...state,
        ...action.payload,
      };
    case 'store/delete': // 删除书籍
      return {
        ...state,
        [action.key]: undefined,
      };
    case 'store/clear': // 清空书架
      return {};
    default:
      return {
        ...state,
      };
  }
}

export default store;
