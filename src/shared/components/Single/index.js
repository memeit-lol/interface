import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import config from '../../config';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../Loader';
import { vote } from '../../sc2';
import { Avatar, Badge, Divider, message, Card, Icon, Modal } from 'antd';
import marked from 'marked';
import {Helmet} from "react-helmet";
import {addpost} from "../../reducers/contentActions";
import {
  getPost
} from "../../reducers";

@connect(
  (state, ownProps) => ({
    post: getPost(state, `/@${ownProps.match.params.author}/${ownProps.match.params.permlink}`)   // Gets post data from redux store
  }),
  { addpost }   // Adds a post to redux store, used during SSR.
)
export default class Single extends Component {
  /**
   * This is for SSR preloading.
   * @param {Object} store - The initial store from the server side rendering.
   * @param {Object} match - Tells where the location is.
   * @returns {Promise} - This adds the single post to the store during rendering for metadata.
   */
  static fetchData({store, match}) {
    return axios.get(config.api + `info?type=post&author=${match.params.author}&permlink=${match.params.permlink}`).then(d => {
      store.dispatch(addpost({post: d.data}));
    })
  }

  /**
   * For the state we need the post data, comments, is loaded, is comments loaded, and is modal visible. 
   * @returns {Object} - This returns the initial state for react.
   */
  state = {
    post: {
      replies: [],
      info: {
        json_metadata: ''
      }
    },
    loaded: false,
    commentLoaded: false,
    visible: false,
    comments: {
      replies: [],
      info: {
        json_metadata: ''
      }
    },
    comment: []
  }

  /**
   * This function is fired when the React component is about to load.
   * This is where we get the post and comments.
   */
  componentWillMount() {
    if (!this.props.post) {
      axios.get(config.api + `info?type=post&author=${this.props.match.params.author}&permlink=${this.props.match.params.permlink}`).then(d => {
        this.props.addpost({post: d.data});
        this.setState({loaded: true});
      })
    } else {
      this.setState({loaded:true});
    }
    axios.get(config.api + `info?type=comments&author=${this.props.match.params.author}&permlink=${this.props.match.params.permlink}`).then(function(d) {
      this.setState({comments: d.data})
      d.data.forEach(comment => {
        this.comments(comment)
      })
      this.setState({commentLoaded: true});
    }.bind(this))
  }

  /**
   * Closes info modal.
   */
  handleCancel() {
    this.setState({ visible: false });
  }

  /**
   * This votes the post and shows a message saying 'Voted!'
   * @param {String} author - The author's username
   * @param {String} permlink - The post's permlink
   */
  vote(author, permlink) {
    message.loading()
    vote(this.props.app.username, author, permlink).then((m) => {
      message.success('Voted!')
    }).catch((e) => {
      message.error('Please try again later!')
    })
  }

  /**
   * This is a recursive loop creating the comment elements.
   * @param {Array} r - Array of replies to a post/comment. 
   */
  comments(r) {
    let author = '';
    if (r.info.json_metadata) {
      try {
        author = JSON.parse(r.info.json_metadata).profile.profile_image;
      } catch (e) {}
    }
    this.state.comment.push((
        <div style={{borderLeft: `${r.depth * 10}px solid #f5f5f5`}} key={`/@${r.author}/${r.permlink}`}>
          <div style={{marginLeft: 10}}>
            <div style={{margin: '20px 0px'}}>
              <Avatar src={author} size="small" />
              <span style={{fontSize: '15px', marginLeft: '5px'}}>{r.author}</span>
            </div>
            <div className='Body' dangerouslySetInnerHTML={{__html: marked(r.body || '')}}></div>
            <div className='ant-card-actions' style={{maxWidth: '60vw', display: 'flex', background: 'none', border: '0'}}>
              <li style={{flex: '1'}}>
                <span><Icon type="up-circle-o" onClick={() => {this.vote(r.author, r.permlink)}} /></span>
              </li>
              <li style={{flex: '1'}}>
                <span><Icon type="edit" /></span>
              </li>
            </div>
          </div>
          <Divider />
        </div>
      ))
    this.setState({comment: this.state.comment})
    if (r.replies.length > 0) {
      r.replies.map(re => {
        this.comments(re)
      })
    }
  }
  
  /**
   * This renders the component onto the DOM.
   */
  render() {
    if (!this.state.loaded) return Loader;
    let comments = this.state.comment.map(c => {
      return c;
    })
    let percentage = 0;
    let score = 0;
    let date;
    if(this.state.loaded) {
      if(this.props.post.db) {
        this.props.post.db.votes.forEach(function (vote) {
          percentage += vote.approved
        })
        percentage /= this.props.post.db.votes.length;
        percentage *= 100;
        date = new Date(this.props.post.db.time);
        score = this.props.post.db.score;
      } else {
        date = new Date(this.props.post.created);
      }
    }
    let src = '';
    let author = '';
    if (this.props.post.json_metadata || this.props.post.info.json_metadata) {
      try {
        src = JSON.parse(this.props.post.json_metadata).image[0];
        author = JSON.parse(this.props.post.info.json_metadata).profile.profile_image;
      } catch (e) {}
    }

    return (
      <div style={{maxWidth: '60vw', margin: '10px auto'}}>
        <Helmet>
          <title>{`${this.props.post.title} by ${this.props.post.author}`} | Memeit.LOL</title>
          <meta property="og:image" content={src} />
          <meta property="og:url" content={`https://test.memeit.lol/@${this.props.post.author}/${this.props.post.permlink}`} />
          <meta property="og:title" content={`${this.props.post.title} by ${this.props.post.author}`} />
          <meta property="og:type" content="website" />
          <meta property="twitter:image" content={src} />
          <meta property="twitter:card" content='summary_large_image' />
          <meta property="twitter:title" content={`${this.props.post.title} by ${this.props.post.author}`} />
        </Helmet>
        <div>
          <Badge count={this.props.post.info.rep}>
            <Avatar src={author} size="large" />
          </Badge>
          <span style={{fontSize: '25px', marginLeft: '20px'}}>@{this.props.post.author}</span>
        </div>
        <h2 style={{padding: '20px 0px'}}>{this.props.post.title}</h2>
        <div style={{width: '100%'}}>
          
          <div className='Body' dangerouslySetInnerHTML={{__html: marked(this.props.post.body || '')}}></div>

          <div className='ant-card-actions' style={{maxWidth: '60vw', display: 'flex', background: 'none', border: '0'}}>
            <li style={{flex: '1'}}>
              <span><Icon type="up-circle-o" onClick={() => {this.vote(this.props.post.author, this.props.post.permlink)}} /></span>
            </li>
            <li style={{flex: '1'}}>
              <span><Icon type="info" onClick={() => {this.setState({visible: true})}} /></span>
            </li>
            <li style={{flex: '1'}}>
              <span><Icon type="edit" /></span>
            </li>
          </div>
        </div>
        <Divider>{this.state.commentLoaded === true && this.state.comments.length > 0 ? 'Comments' : 'No Comments'}</Divider>
        {this.state.commentLoaded === true ? comments : Loader}
        <Modal
          visible={this.state.visible}
          title={`${this.props.post.title} by @${this.props.post.author}`}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
          <p>ModScore: {score}</p>
          <p>ModPercentage: {percentage.toFixed()}%</p>
          <p>Date: {`${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() }:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}${date.getHours() > 12 ? 'PM' : 'AM' } ${date.toDateString()}`}</p>
          <p>Comments: {this.props.post.children}</p>
          <p>Payout: {this.props.post.total_payout_value}</p>
        </Modal>
      </div>
    );
  }
}
