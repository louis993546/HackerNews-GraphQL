const rq = require('request-promise-native');
const redis = require('redis');
const { promisify } = require('util');
const log = require('loglevel');

const timeout = 100; // TODO move this to some kind of configurable
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

function generateOption(endpoint) {
  return {
    json: true,
    uri: `https://hacker-news.firebaseio.com/v0${endpoint}`,
  };
}

async function redisOrRequest(key, request) {
  const cache = await getAsync(key);
  if (cache) {
    log.debug(`cache found for ${key}`);
    return JSON.parse(cache);
  }
  log.debug(`cache not found for ${key}`);
  const response = await request;
  client.setex(key, timeout, JSON.stringify(response));
  return response;
}

module.exports = {
  getItem(id) {
    const key = `item_${id}`;
    const request = rq(generateOption(`/item/${id}.json`));
    return redisOrRequest(key, request);
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
