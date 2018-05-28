import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import sc2, {
  accessToken
} from '../sc2';
import { withCookies } from 'react-cookie';
import { token } from '../reducers/authActions';

@withCookies
@connect(state => ({}), {
  token
})
export default class Callback extends Component {
  static fetchData({store, match}) {
    return null;
  }
  componentWillMount() {
    let username = this.props.history.location.search.substring(1).split('&')[2].split('=')[1];
    let accesstoken = this.props.history.location.search.substring(1).split('&')[0].split('=')[1];
    accessToken(accesstoken);
    sc2.me(function (err, d) {
      this.props.cookies.set('token', accesstoken, { path: '/' });
      this.props.token({ token: accesstoken });
      this.props.history.push('/');
    }.bind(this))
  }
  render() {
    return null;
  }
}
