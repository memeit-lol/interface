import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducers from './reducers'

/**
 * @returns {Object} - Returns a redux store.
 */
export default createStore(reducers, {}, applyMiddleware(thunk, logger))
