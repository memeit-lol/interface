import {
  ADDPOST
} from './contentActions';

/**
 * This is the initial state used in the content reducer.
 */
const initialState = {
  posts: {}
};

/**
 * Adds post in the store.
 * @param {Object} state - A state for the redux store
 * @param {Object} action - A redux action.
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADDPOST: {
      let posts = state.posts;
      posts[`/@${action.payload.post.author}/${action.payload.post.permlink}`] = action.payload.post;
      return {
        ...state,
        posts
      }
    }
    default: {
      return state;
    }
  }
}

/**
 * @param {Object} state - The state used in the store
 * @returns {Array} - Returns all posts in the store.
 */
export const getPosts = state => state.posts;
/**
 * 
 * @param {Object} state - The state used in the store
 * @param {String} postDec - The unique post identifier using the author's name and post permlink
 * @returns {Object} - Returns a single post
 */
export const getPost = (state, postDec) => state.posts[postDec];