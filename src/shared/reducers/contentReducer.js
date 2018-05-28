import {
  ADDPOST
} from './contentActions';

const initialState = {
  posts: {}
};

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

export const getPosts = state => state.posts;
export const getPost = (state, postDec) => state.posts[postDec];