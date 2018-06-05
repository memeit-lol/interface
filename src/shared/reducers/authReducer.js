import {
  LOGIN,
  LOGOUT
} from './authActions';

const initialState = {
  username: '',
  isMod: false,
  isLogged: false,
  user: {}
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