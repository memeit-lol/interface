import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducers from './reducers';

let preloadedState = {};
if(typeof window !== 'undefined') {
  preloadedState = window.__PRELOADED_STATE__
  delete window.__PRELOADED_STATE__
}

export default createStore(reducers, preloadedState, applyMiddleware(thunk, logger));