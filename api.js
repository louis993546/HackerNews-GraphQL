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
  return rq(generateOption('/maxitem.json'));
};

exports.getNewStories = function getNewStories() {
  return rq(generateOption('/newstories.json'));
};

exports.getTopStories = function getTopStories() {
  return rq(generateOption('/topstories.json'));
};

exports.getBestStories = function getBestStories() {
  return rq(generateOption('/beststories.json'));
};

exports.getAskStories = function getAskStories() {
  return rq(generateOption('/askstories.json'));
};

exports.getShowStories = function getShowStories() {
  return rq(generateOption('/showstories.json'));
};

exports.getJobStories = function getJobStories() {
  return rq(generateOption('/jobstories.json'));
};

exports.getUpdates = function getUpdates() {
  return rq(generateOption('/updates.json'));
};
