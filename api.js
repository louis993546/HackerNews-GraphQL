const rq = require('request-promise-native');
const DataLoader = require('dataloader');

function generateOption(endpoint) {
  return {
    json: true,
    uri: `https://hacker-news.firebaseio.com/v0${endpoint}`,
  };
}

const itemLoader = new DataLoader(
  id => Promise.all([rq(generateOption(`/item/${id}.json`))]),
  { batch: false, cacheKeyFn: key => `${key}_${Math.floor(Date.now() / 1000)}` },
);

module.exports = {
  getItem(id) {
    return itemLoader.load(id);
  },
  getUser(handle) {
    return rq(generateOption(`/user/${handle}.json`));
  },
  getMaxItem() {
    return rq(generateOption('/maxitem.json'));
  },
  getNewStories() {
    return rq(generateOption('/newstories.json'));
  },
  getTopStories() {
    return rq(generateOption('/topstories.json'));
  },
  getBestStories() {
    return rq(generateOption('/beststories.json'));
  },
  getAskStories() {
    return rq(generateOption('/askstories.json'));
  },
  getShowStories() {
    return rq(generateOption('/showstories.json'));
  },
  getJobStories() {
    return rq(generateOption('/jobstories.json'));
  },
  getUpdates() {
    return rq(generateOption('/updates.json'));
  },
};
