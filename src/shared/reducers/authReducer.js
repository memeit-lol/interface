import {
  LOGIN,
  LOGOUT
} from './authActions'

/**
 * This is the initial state used in the auth reducer.
 */
const initialState = {
  username: '',
  isMod: false,
  isLogged: false,
  user: {}
}

/**
 * Logs in or out a user.
 * @param {Object} state - A state for the redux store
 * @param {Object} action - A redux action.
 */
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        username: action.payload.username,
        isMod: action.payload.isMod,
        isLogged: action.payload.isLogged,
        user: action.payload.user
      }
    }
    case LOGOUT: {
      return initialState
    }
    default: {
      return state
    }
  }
}

/**
 * @param {Object} state - The state used in the store
 * @returns {String} - Returns the username stored in the store.
 */
export const getUsername = state => state.username
/**
 * @param {Object} state - The state used in the store
 * @returns {Boolean} - Returns is the user is a mod.
 */
export const getIsMod = state => state.isMod
/**
 * @param {Object} state - The state used in the store
 * @returns {Boolean} - Returns is the user is logged in.
 */
export const getIsLogged = state => state.isLogged
/**
 * @param {Object} state - The state used in the store
 * @returns {Object} - Returns is information of the user from steemconnect.
 */
export const getUser = state => state.user
