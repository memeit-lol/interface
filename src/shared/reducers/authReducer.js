import {
  LOGIN,
  LOGOUT,
  TOKEN
} from './authActions';

const initialState = {
  username: '',
  isMod: false,
  isLogged: false,
  user: {},
  token: ''
};

export default function reducer(state = initialState, action) {
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
    case TOKEN: {
      return {
        ...state,
        token: action.payload.token
      }
    }
    case LOGOUT: {
      return initialState
    }
    default: {
      return state;
    }
  }
}

export const getUsername = state => state.username;
export const getIsMod = state => state.isMod;
export const getIsLogged = state => state.isLogged;
export const getUser = state => state.user;
export const getToken = state => state.token;