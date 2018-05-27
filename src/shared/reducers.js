import { combineReducers } from 'redux';

import appReducer, * as fromApp from './reducers/authReducer';

const reducers = combineReducers({
  app: appReducer
});

export default reducers;

export const getUsername = state => fromApp.getUsername(state.app);
export const getIsMod = state => fromApp.getIsMod(state.app);
export const getIsLogged = state => fromApp.getIsLogged(state.app);
export const getUser = state => fromApp.getUser(state.app);
export const getToken = state => fromApp.getToken(state.app);