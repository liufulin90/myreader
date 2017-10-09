import React from 'react';
import {
  // BrowserRouter as Router,
  HashRouter as Router, // 使用hash路由解决一些页面无法刷新问题
  Route,   // 这是基本的路由块
  // Link,    // 这是a标签/
  // Switch,   // 这是监听空路由的
  // Redirect, // 这是重定向
  // Prompt,   // 防止转换
} from 'react-router-dom';
import { Provider } from 'react-redux';
import FastClick from 'fastclick';
import 'sweetalert2/dist/sweetalert2.min.css';

import './index.less';
import Index from './routes/IndexPage';
import Search from './routes/Search';
import Detail from './routes/Detail';
import Reader from './routes/Reader';
import Chapters from './routes/Chapters';
import store from './store';
import Loading from './routes/Loading';

FastClick.attach(document.body);

// 模板，套路
const RouterConfig = () => (
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/" exact component={Index} />
        <Route path="/cps" exact component={Chapters} />
        <Route path="/search" exact component={Search} />
        <Route path="/book/:id" exact component={Detail} />
        <Route path="/reader/:id" exact component={Reader} />
        <Loading />
      </div>
    </Router>
  </Provider>
);

export default RouterConfig;
