import React, {
  Component
} from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

@withCookies // Adds this.props.cookies object.
@connect(state => ({
  app: state.app // Hold app variables such as the user object, if the user is logged in, and username.
}))
export default function LoginRequired (WrappedComponent) {
  return class extends Component {
  /**
     * This function is fired when the React component is about to load.
     * Checks to see is user is logged in.
     * If yes, continue, else got to '/' route.
     */
  componentWillMount () {
    if (!this.props.app.isLogged && !this.props.cookies.get('token')) this.props.history.push('/')
  }

  /**
     * This renders the component onto the DOM.
     */
  render () {
    return <WrappedComponent {...this.props} />
  }
}
}
