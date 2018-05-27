var sc2 = require('sc2-sdk');

const api = sc2.Initialize({
  app: 'memeit.lol.app',
  callbackURL: 'http://localhost:8000/callback',
  scope: ['vote', 'comment', 'comment_options', 'offline']
});

export default api;

export const accessToken = function (token) {
  api.setAccessToken(token);
}

export const vote = function (voter, author, permlink) {
  return new Promise((resolve, reject) => {
    api.vote(voter, author, permlink, 10000, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  })
}