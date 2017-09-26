/**
 * Created by liufulin on 17-9-26.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loading from '../../components/Loading';

class LoadingPage extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    const { loading } = this.props;
    return (<Loading loading={loading} />);
  }
}

function mapStateToProps(state) {
  const { loading } = state.common;
  return {
    loading,
  };
}

export default connect(mapStateToProps)(LoadingPage);
