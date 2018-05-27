import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  login,
  logout
} from '../../reducers/authActions';
import sc2, { vote } from '../../sc2';
import { withCookies } from 'react-cookie';
import axios from 'axios';
import config from '../../config';
import InfiniteScroll from 'react-infinite-scroller';
import PostPreview from '../PostPreview';
import Loader from '../Loader';
import { message } from 'antd';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      num: 0
    }
  }
  getMore() {
    axios.get(config.api + 'post?$sort[time]=-1&score[$gt]=0&$skip=' + (this.state.num * 10)).then(d => {
      this.setState({ num: this.state.num + 1, posts: [...this.state.posts, ...d.data.data]})
    })
  }
  change(author, permlink) {
    this.props.history.push(`/@${author}/${permlink}`)
  }
  vote(author, permlink) {
    message.loading()
    vote(this.props.app.username, author, permlink).then((m) => {
      message.success('Voted!')
    }).catch((e) => {
      message.error('Please try again later!')
    })
  }
  render() {
    return (
      <InfiniteScroll
        loadMore={this.getMore.bind(this)}
        hasMore={true}
      >
        {this.state.posts.length > 0 ? this.state.posts.map(p => {
          return <PostPreview vote={() => this.vote(p.author, p.permlink)} change={() => this.change(p.author, p.permlink)} post={p}/>
        }): Loader}
      </InfiniteScroll>
    );
  }
}
App.propTypes = {
  actions: PropTypes.shape({
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  }),
  app: PropTypes.shape({})
};
function mapStateToProps(state) {
  const props = { app: state.app };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actions = {
    login,
    logout
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withCookies(connect(mapStateToProps, mapDispatchToProps)(App));
