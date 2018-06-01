import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

@withCookies
@connect(state => ({app: state.app}), {})
export default function LoginRequired(WrappedComponent) {
  return class extends Component {
    componentWillMount() {
      if (!this.props.app.isLogged && !this.props.cookies.get('token')) this.props.history.push('/')
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}