import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import sc2, {
  accessToken
} from '../sc2';
import { withCookies } from 'react-cookie';

@withCookies    // Adds this.props.cookies object.
export default class Callback extends Component {
  /**
   * This is for SSR preloading.
   * @param {Object} store - The initial store from the server side rendering.
   * @param {Object} match - Tells where the location is.
   * @returns {null} - We don't need this for the editor.
   */
  static fetchData({store, match}) {
    return null;
  }

  /**
   * This function is fired when the React component is about to load.
   * This logs in a user and stores the sc2 access token in cookies.
   */
  componentWillMount() {
    let username = this.props.history.location.search.substring(1).split('&')[2].split('=')[1];
    let accesstoken = this.props.history.location.search.substring(1).split('&')[0].split('=')[1];
    accessToken(accesstoken);
    sc2.me(function (err, d) {
      this.props.cookies.set('token', accesstoken, { path: '/' });
      this.props.history.push('/');
    }.bind(this))
  }

  /**
   * This renders the component onto the DOM.
   */
  render() {
    return null;
  }
}
