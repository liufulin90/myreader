import React, { Component } from 'react';
import { connect } from 'react-redux';

import SearchBar from '../../components/SearchBar';
import Item from './Item';

class Search extends Component {
  constructor(props) {
    super(props);
    this.search = (val) => {
      this.props.history.push(`/search?keyword=${val}`);
      this.props.dispatch({
        type: 'reader/search',
        query: {
          query: val,
        },
      });
    };
    this.goToDetail = (id) => {
      this.props.history.push(`/book/${id}`);
    };
  }
  componentWillMount() {
    const { status, list } = this.props;
    this.props.dispatch({
      type: 'search/save',
      payload: {
        status: false,
        list: status ? list : [],
      },
    });
  }
  componentDidMount() {
    this.input.input.focus();
  }
  renderList = (list, status) => {
    if (status && !list.length) {
      return (<div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)' }}>哦噢，没找到你想要的呢 ╮(￣▽￣)╭ </div>);
    }
    return list.map(i => (<div onClick={this.goToDetail.bind(this, i._id)} key={i._id}>
      <Item {...i} />
    </div>));
  }
  render() {
    const { list = [], status, history } = this.props;
    return (<div>
      <SearchBar ref={(c) => { this.input = c; }} history={history} onSubmit={this.search} />
      {this.renderList(list, status)}
    </div>);
  }
}

function mapStateToProps(state) {
  const { list, status } = state.search;
  return {
    list,
    status,
  };
}

export default connect(mapStateToProps)(Search);
