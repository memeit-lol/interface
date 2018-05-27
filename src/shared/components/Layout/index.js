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
import {
  Layout,
  Menu,
  Dropdown,
  Avatar
} from 'antd';
const {Header, Footer, Sider, Content} = Layout;
import sc2 from '../../sc2';
import { withCookies } from 'react-cookie';
import axios from 'axios';
import config from '../../config';
import '../../styles/base.less';
import { renderRoutes } from 'react-router-config';
import routes from "../../routes";
import icon from "./icon.png";

class App extends Component {
  login() {
    window.location = sc2.getLoginURL();
  }
  logout() {
    this.props.actions.logout();
    this.props.cookies.remove('token');
  }
  componentWillUpdate() {
    if (!this.props.app.isLogged) {
      if (this.props.app.token) {
        sc2.setAccessToken(this.props.app.token);
        sc2.me(function (err, d) {
          this.props.actions.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      } 
      if(this.props.cookies.get('token')) {
        sc2.setAccessToken(this.props.cookies.get('token'));
        sc2.me(function (err, d) {
          this.props.actions.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      }
    }
  }
  componentWillMount() {
    if (!this.props.app.isLogged) {
      if (this.props.app.token) {
        sc2.setAccessToken(this.props.app.token);
        sc2.me(function (err, d) {
          this.props.actions.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      } 
      if(this.props.cookies.get('token')) {
        sc2.setAccessToken(this.props.cookies.get('token'));
        sc2.me(function (err, d) {
          this.props.actions.login({username: d.user, isLogged: true, isMod: false, user: d.account})
        }.bind(this))
      }
    }
  }
  render() {
    let menu = this.props.app.isLogged ? (
      <Menu theme='dark' defaultSelectedKeys={[]} style={{ lineHeight: '64px' }}>
        <Menu.Item key='1' onClick={this.logout.bind(this)}>Logout</Menu.Item>
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
                this.props.app.isLogged ? <Avatar src={JSON.parse(this.props.app.user.json_metadata).profile.profile_image} /> : <span>Menu</span>
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
