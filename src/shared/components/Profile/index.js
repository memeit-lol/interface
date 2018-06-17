import React, {
  Component
} from 'react'
import { connect } from 'react-redux'
import { vote } from '../../sc2'
import { withCookies } from 'react-cookie' // eslint-disable-line
import axios from 'axios'
import config from '../../config'
import InfiniteScroll from 'react-infinite-scroller'
import PostPreview from '../PostPreview'
import UserProfile from '../UserProfile'
import Loader from '../Loader'
import { message,Timeline } from 'antd'
import {Helmet} from 'react-helmet'

@connect(state => ({ // eslint-disable-line
  app: state.app // Hold app variables such as the user object, if the user is logged in, and username.
}))
export default class Profile extends Component {
  /**
   * For the state we need the array of posts, and the pagination number.
   * @returns {Object} - This returns the initial state for react.
   */
  state = {
    posts: [],
    num: 1,
    user:[]
  }

  /**
   * This is for SSR preloading.
   * @param {Object} store - The initial store from the server side rendering.
   * @param {Object} match - Tells where the location is.
   * @returns {null} - We don't need this for the editor.
   */
  static fetchData ({store, match}) {
    return null
  }

  /**
   * Gets more posts and adds them to the React Infinate Scroller.
   */
  getMore () {
    axios.get(config.api + 'me?author='+this.props.match.params.username+'&skip=' + this.state.num ).then(d => {
      this.setState({ num:this.state.num, posts: [...this.state.posts, ...d.data.data] })
      console.log(this.state)
    })
  }

  /**
   * Gets more posts and adds them to the React Infinate Scroller.
   */
  componentWillMount () {
    axios.get(config.api + 'me?author='+this.props.match.params.username+'&skip=0' ).then(d => {
      this.setState({ num:this.state.num, posts:this.state.posts,user: [...this.state.user, ...d.data.user]  })
      console.log(this.state)
    })
  }

  /**
   * This redirects to the single posts page
   * @param {String} author - The author's username
   * @param {String} permlink - The post's permlink
   */
  change (author, permlink) {
    this.props.history.push(`/@${author}/${permlink}`)
  }

  /**
   * This votes a post and shows a message saying 'Voted!'
   * @param {String} author - The author's username
   * @param {String} permlink - The post's permlink
   */
  vote (author, permlink) {
    message.loading()
    vote(this.props.app.username, author, permlink).then((m) => {
      message.success('Voted!')
    }).catch((e) => {
      message.error('Please try again later!')
    })
  }

  /**
   * This renders the component onto the DOM.
   */
  render () {
    let src = ''
    let author = ''
    

    return (
      <div>
        <Helmet>
          <title>Profile | Memeit.LOL</title>
        </Helmet>
        {this.state.user.length > 0 ? this.state.user.map(u => {
            return <UserProfile user={u}></UserProfile>
          }) : Loader}

        <h1 align="center">Recent Memes</h1>
       
        <InfiniteScroll
          loadMore={this.getMore.bind(this)}
          hasMore
        >
          {this.state.posts.length > 0 ? this.state.posts.map(p => {
            return <PostPreview vote={() => this.vote(p.author, p.permlink)} change={() => this.change(p.author, p.permlink)} post={p} />
          }) : <h1 align="center">This user has No Memes to Show here yet! </h1>}
        </InfiniteScroll>
        
      </div>
    )
  }
}
