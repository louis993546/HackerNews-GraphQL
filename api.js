const request = require('request');

const options = {
  json: true,
  baseUrl: 'https://hacker-news.firebaseio.com/v0/',
};

function something(url, callback) {
  request(url, options, (err, response, body) => callback(err, response, body));
}

exports.getItem = function getItem(id, callback) {
  something(`/item/${id}.json`, callback);
};

exports.getUser = function getUser(handle, callback) {
  something(`/user/${handle}.json`, callback);
};

exports.getMaxItem = function getMaxItem(callback) {
  something('/v0/maxitem', callback);
};

exports.getNewStories = function getNewStories(callback) {
  something('/v0/newstories', callback);
};

exports.getTopStories = function getTopStories(callback) {
  something('/v0/topstories', callback);
};

exports.getBestStories = function getBestStories(callback) {
  request('/v0/beststories', callback);
};

exports.getAskStories = function getAskStories(callback) {
  something('/v0/askstories', callback);
};

exports.getShowStories = function getShowStories(callback) {
  something('/v0/showstories', callback);
};

exports.getJobStories = function getJobStories(callback) {
  something('/v0/jobstories', callback);
};

exports.getUpdates = function getUpdates(callback) {
  something('/v0/updates', callback);
};

// // For testing only
// getItem(1234, (err, resp, body) => {
//   console.log(body);
// });
