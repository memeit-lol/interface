import React, {
  Component
} from 'react'
import { connect } from 'react-redux'
import {
  login,
  logout
} from '../../reducers/authActions'
import {
  Layout,
  Menu,
  Dropdown,
  Avatar
} from 'antd'
import sc2 from '../../sc2'
import { withCookies } from 'react-cookie'
import '../../styles/base.less'
import { renderRoutes } from 'react-router-config'
import icon from './icon.png'
const {Header, Content} = Layout

@withCookies // eslint-disable-line
@connect( // eslint-disable-line
  state => ({
    app: state.app // Hold app variables such as the user object, if the user is logged in, and username.
  }), {
    login, logout // Redux actions that are added to this.props
  }
)
export default class App extends Component {
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
   * Redirects the window to the SteemConnect login portal.
   */
  login () {
    window.location = sc2.getLoginURL()
  }

  /**
   * Logs out user and removes token cookie.
   */
  logout () {
    this.props.logout()
    this.props.cookies.remove('token')
  }

  /**
   * This is ran after the React component was mounted.
   * If there is a cookie, login.
   */
  componentWillMount () {
    if (this.props.cookies.get('token')) {
      sc2.setAccessToken(this.props.cookies.get('token'))
      sc2.me(function (err, d) {
        if (err) console.log(err)
        this.props.login({username: d.user, isLogged: true, isMod: false, user: d.account})
      }.bind(this))
    }
  }

  /**
   * This is ran before the React component will mount.
   * If there is a cookie, login.
   */
  componentWillUpdate () {
    if (this.props.cookies.get('token') && !this.props.app.isLogged) {
      sc2.setAccessToken(this.props.cookies.get('token'))
      sc2.me(function (err, d) {
        if (err) console.log(err)
        this.props.login({username: d.user, isLogged: true, isMod: false, user: d.account})
      }.bind(this))
    }
  }

  /**
   * This renders the component onto the DOM.
   */
  render () {
    let avatar = ''
    try {
      avatar = JSON.parse(this.props.app.user.json_metadata).profile.profile_image
    } catch (e) {}
    let menu = this.props.app.isLogged ? (
      <Menu theme='dark' defaultSelectedKeys={[]} style={{ lineHeight: '64px' }}>
        <Menu.Item key='1' onClick={this.logout.bind(this)}>Logout</Menu.Item>
        <Menu.Item key='2' onClick={() => this.props.history.push('/write')}>Editor</Menu.Item>
        <Menu.Item key='3' onClick={() => this.props.history.push('/@'+this.props.app.username)}>Profile</Menu.Item>
      </Menu>
    ) : (
      <Menu theme='dark' defaultSelectedKeys={[]} style={{ lineHeight: '64px' }}>
        <Menu.Item key='1' onClick={this.login.bind(this)}>Login</Menu.Item>
      </Menu>
    )
    return (
      <Layout>
        <Header>
          <Avatar src={icon} onClick={() => { this.props.history.push('/') }} />
          <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
            <a
              style={{
                color: '#ffffff',
                float: 'right'
              }} className='ant-dropdown-link' href='#'>
              {
                this.props.app.isLogged ? <Avatar src={avatar} /> : <span>Menu</span>
              }
            </a>
          </Dropdown>
        </Header>
        <Content>
          {renderRoutes(this.props.route.routes)}
        </Content>
      </Layout>
    )
  }
}
