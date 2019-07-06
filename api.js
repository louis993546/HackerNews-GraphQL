const rq = require('request-promise-native');

function generateOption(endpoint) {
  return {
    json: true,
    uri: `https://hacker-news.firebaseio.com/v0${endpoint}`,
  };
}

exports.getItem = function getItem(id) {
  return rq(generateOption(`/item/${id}.json`));
};

exports.getUser = function getUser(handle) {
  return rq(generateOption(`/user/${handle}.json`));
};

exports.getMaxItem = function getMaxItem() {
  return rq(generateOption('/v0/maxitem'));
};

exports.getNewStories = function getNewStories() {
  return rq(generateOption('/v0/newstories'));
};

exports.getTopStories = function getTopStories() {
  return rq(generateOption('/v0/topstories'));
};

exports.getBestStories = function getBestStories() {
  return rq(generateOption('/v0/beststories'));
};

exports.getAskStories = function getAskStories() {
  return rq(generateOption('/v0/askstories'));
};

exports.getShowStories = function getShowStories() {
  return rq(generateOption('/v0/showstories'));
};

exports.getJobStories = function getJobStories() {
  return rq(generateOption('/v0/jobstories'));
};

exports.getUpdates = function getUpdates() {
  return rq(generateOption('/v0/updates'));
};
