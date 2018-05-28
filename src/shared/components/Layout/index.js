import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import {
  login,
  logout
} from '../../reducers/authActions';
import {
  Layout,
  Menu,
  Dropdown,
  Avatar
} from 'antd';
const {Header, Footer, Sider, Content} = Layout;
import sc2 from '../../sc2';
import { withCookies } from 'react-cookie';
import '../../styles/base.less';
import { renderRoutes } from 'react-router-config';
import routes from "../../routes";
import icon from "./icon.png";

@withCookies
@connect(
  state => ({
    app: state.app
  }), {
    login, logout
  }
)
export default class App extends Component {
  static fetchData({store, match}) {
    return null;
  }
  login() {
    window.location = sc2.getLoginURL();
  }
  logout() {
    this.props.logout();
    this.props.cookies.remove('token');
  }
  componentWillUpdate() {
    if (!this.props.app.isLogged) {
      if (this.props.app.token) {
        sc2.setAccessToken(this.props.app.token);
        sc2.me(function (err, d) {
          this.props.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      } 
      if(this.props.cookies.get('token')) {
        sc2.setAccessToken(this.props.cookies.get('token'));
        sc2.me(function (err, d) {
          this.props.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      }
    }
  }
  componentWillMount() {
    if (!this.props.app.isLogged) {
      if (this.props.app.token) {
        sc2.setAccessToken(this.props.app.token);
        sc2.me(function (err, d) {
          this.props.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      } 
      if(this.props.cookies.get('token')) {
        sc2.setAccessToken(this.props.cookies.get('token'));
        sc2.me(function (err, d) {
          this.props.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      }
    }
  }
  render() {
    let avatar = '';
    try {
      avatar = JSON.parse(this.props.app.user.json_metadata).profile.profile_image
    } catch (e) {}
    let menu = this.props.app.isLogged ? (
      <Menu theme='dark' defaultSelectedKeys={[]} style={{ lineHeight: '64px' }}>
        <Menu.Item key='1' onClick={this.logout.bind(this)}>Logout</Menu.Item>
        <Menu.Item key='2' onClick={() => this.props.history.push('/write')}>Editor</Menu.Item>
      </Menu>
    ) : (
      <Menu theme='dark' defaultSelectedKeys={[]} style={{ lineHeight: '64px' }}>
        <Menu.Item key='1' onClick={this.login.bind(this)}>Login</Menu.Item>
      </Menu>
    );
    return (
      <Layout>
        <Header>
          <Avatar src={icon} onClick={() => {this.props.history.push('/')}} />
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
    );
  }
}
