import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sc2, {
  accessToken
} from '../sc2';
import { withCookies } from 'react-cookie';
import axios from 'axios';
import config from '../config';
import { token } from '../reducers/authActions';

class App extends Component {
  componentWillMount() {
    let username = this.props.history.location.search.substring(1).split('&')[2].split('=')[1];
    let accesstoken = this.props.history.location.search.substring(1).split('&')[0].split('=')[1];
    accessToken(accesstoken);
    sc2.me(function (err, d) {
      this.props.cookies.set('token', accesstoken, { path: '/' });
      this.props.actions.token({ token: accesstoken });
      this.props.history.push('/');
    }.bind(this))
  }
  render() {
    return null;
  }
}

App.propTypes = {
  actions: PropTypes.shape({
    token: PropTypes.func.isRequired
  })
};

function mapDispatchToProps(dispatch) {
  const actions = {
    token
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default withCookies(connect(null, mapDispatchToProps)(App));
