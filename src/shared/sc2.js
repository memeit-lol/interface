var sc2 = require('sc2-sdk');

const api = sc2.Initialize({
  app: 'memeit.lol.app',
  callbackURL: 'http://localhost:8000/callback',
  scope: ['vote', 'comment', 'comment_options', 'offline']
});

export default api;

/**
 * Stores the access token into the sc2 api.
 * @param {String} token - An access token from SteemConnect
 */
export const accessToken = function (token) {
  api.setAccessToken(token);
}

/**
 * Upvotes a post with 100% voting power.
 * @param {String} voter - Username of the voter
 * @param {String} author - Username of the author
 * @param {String} permlink - The post's permlink
 */
export const vote = function (voter, author, permlink) {
  return new Promise((resolve, reject) => {
    api.vote(voter, author, permlink, 10000, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  })
}