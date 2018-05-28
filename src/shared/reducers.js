import { combineReducers } from 'redux';

import appReducer, * as fromApp from './reducers/authReducer';
import postsReducer, * as fromPosts from './reducers/contentReducer';

const reducers = combineReducers({
  app: appReducer,
  posts: postsReducer
});

export default reducers;

export const getUsername = state => fromApp.getUsername(state.app);
export const getIsMod = state => fromApp.getIsMod(state.app);
export const getIsLogged = state => fromApp.getIsLogged(state.app);
export const getUser = state => fromApp.getUser(state.app);
export const getToken = state => fromApp.getToken(state.app);

export const getPosts = state => fromPosts.getPosts(state.posts);
export const getPost = (state, postDec) => fromPosts.getPost(state.posts, postDec);