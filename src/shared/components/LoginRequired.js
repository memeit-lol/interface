import React, {
  Component
} from 'react';
import { connect } from 'react-redux';

@connect(state => ({app: state.app}), {})
export default function LoginRequired(WrappedComponent) {
  return class extends Component {
    componentWillMount() {
      if (!this.props.app.isLogged) this.props.history.push('/')
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}