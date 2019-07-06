const request = require('request');

const options = {
  json: true,
  baseUrl: 'https://hacker-news.firebaseio.com/v0/',
};

function something(url, callback) {
  request(url, options, (err, response, body) => callback(err, response, body));
}

function getItem(id, callback) {
  something(`/item/${id}.json`, callback);
}

function getUser(handle, callback) {
  something(`/user/${handle}.json`, callback);
}

function getMaxItem(callback) {
  something('/v0/maxitem', callback);
}

function getNewStories(callback) {
  something('/v0/newstories', callback);
}

function getTopStories(callback) {
  something('/v0/topstories', callback);
}

function getBestStories(callback) {
  request('/v0/beststories', callback);
}

function getAskStories(callback) {
  something('/v0/askstories', callback);
}

function getShowStories(callback) {
  something('/v0/showstories', callback);
}

function getJobStories(callback) {
  something('/v0/jobstories', callback);
}

function getUpdates(callback) {
  something('/v0/updates', callback);
}

// // For testing only
// getItem(1234, (err, resp, body) => {
//   console.log(body);
// });
