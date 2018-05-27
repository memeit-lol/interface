import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import axios from 'axios';
import config from '../../config';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../Loader';
import { vote } from '../../sc2';
import { Avatar, Badge, Divider, message, Card, Icon, Modal } from 'antd';
import marked from 'marked';
import {Helmet} from "react-helmet";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
  }

  fetchData(da) {
    axios.get(config.api + `info?type=post&author=${da.match.params.author}&permlink=${da.match.params.permlink}`).then(function(d) {
      this.setState({post: d.data, loaded: true})
    }.bind(this))
  }

  componentWillMount() {
    axios.get(config.api + `info?type=post&author=${this.props.match.params.author}&permlink=${this.props.match.params.permlink}`).then(function(d) {
      this.setState({post: d.data, loaded: true})
    }.bind(this))
    axios.get(config.api + `info?type=comments&author=${this.props.match.params.author}&permlink=${this.props.match.params.permlink}`).then(function(d) {
      this.setState({comments: d.data})
      d.data.forEach(comment => {
        this.comments(comment)
      })
      this.setState({commentLoaded: true});
    }.bind(this))
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  vote(author, permlink) {
    message.loading()
    vote(this.props.app.username, author, permlink).then((m) => {
      message.success('Voted!')
    }).catch((e) => {
      message.error('Please try again later!')
    })
  }

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
  
  render() {
    if (!this.state.loaded) return Loader;
    let comments = this.state.comment.map(c => {
      return c;
    })
    let percentage = 0;
    let score = 0;
    let date;
    if(this.state.loaded) {
      if(this.state.post.db) {
        this.state.post.db.votes.forEach(function (vote) {
          percentage += vote.approved
        })
        percentage /= this.state.post.db.votes.length;
        percentage *= 100;
        date = new Date(this.state.post.db.time);
        score = this.state.post.db.score;
      } else {
        date = new Date(this.state.post.created);
      }
    }
    let src = '';
    let author = '';
    if (this.state.post.json_metadata) {
      try {
        src = JSON.parse(this.state.post.json_metadata).image[0]
      } catch (e) {}
    }
    if (this.state.post.info.json_metadata) {
      author = JSON.parse(this.state.post.info.json_metadata).profile.profile_image;
    }
    
    return (
      <div style={{maxWidth: '60vw', margin: '10px auto'}}>
        <Helmet>
          <meta property="og:image" content={src} />
          <meta property="og:url" content={`https://test.memeit.lol/@${this.state.post.author}/${this.state.post.permlink}`} />
          <meta property="og:title" content={`${this.state.post.title} by ${this.state.post.author}`} />
          <meta property="og:type" content="website" />
          <meta property="twitter:image" content={src} />
          <meta property="twitter:card" content='summary_large_image' />
          <meta property="twitter:title" content={`${this.state.post.title} by ${this.state.post.author}`} />
        </Helmet>
        <div>
          <Badge count={this.state.post.info.rep}>
            <Avatar src={author} size="large" />
          </Badge>
          <span style={{fontSize: '25px', marginLeft: '20px'}}>@{this.state.post.author}</span>
        </div>
        <h2 style={{padding: '20px 0px'}}>{this.state.post.title}</h2>
        <div style={{width: '100%'}}>
          
          <div className='Body' dangerouslySetInnerHTML={{__html: marked(this.state.post.body || '')}}></div>

          <div className='ant-card-actions' style={{maxWidth: '60vw', display: 'flex', background: 'none', border: '0'}}>
            <li style={{flex: '1'}}>
              <span><Icon type="up-circle-o" onClick={() => {this.vote(this.state.post.author, this.state.post.permlink)}} /></span>
            </li>
            <li style={{flex: '1'}}>
              <span><Icon type="info" onClick={() => {this.setState({visible: true})}} /></span>
            </li>
            <li style={{flex: '1'}}>
              <span><Icon type="edit" /></span>
            </li>
          </div>
        </div>
        <Divider>Comments</Divider>
        {this.state.commentLoaded === true ? comments : Loader}
        <Modal
          visible={this.state.visible}
          title={`${this.state.post.title} by @${this.state.post.author}`}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
          <p>ModScore: {score}</p>
          <p>ModPercentage: {percentage.toFixed()}%</p>
          <p>Date: {`${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() }:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}${date.getHours() > 12 ? 'PM' : 'AM' } ${date.toDateString()}`}</p>
          <p>Comments: {this.state.post.children}</p>
          <p>Payout: {this.state.post.total_payout_value}</p>
        </Modal>
      </div>
    );
  }
}
App.propTypes = {
  app: PropTypes.shape({})
};
function mapStateToProps(state) {
  const props = { app: state.app };
  return props;
}
export default withCookies(connect(mapStateToProps, null)(App));
