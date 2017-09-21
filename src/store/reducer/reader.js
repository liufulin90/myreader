const initState = {
  id: null,           // 当前书籍id，默认没有书籍
  currentSource: 1,   // 当前源下标：默认为1，跳过优质书源
  currentChapter: 0,  // 当前章节下标
  source: [],         // 源列表
  chapters: [],       // 章节列表
  chapter: {},        // 当前章节
  detail: {},         // 书籍详情
  menuState: false,   // 底部菜单是否展开
};

function reader(state = initState, action) {
  switch (action.type) {
    case 'reader/save':
      return {
        ...state,
        ...action.payload,
      };
    case 'reader/clear':
      return initState;
    default:
      return {
        ...state,
      };
  }
}

export default reader;
