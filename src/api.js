const rq = require('request-promise-native');
const redis = require('redis');
const { promisify } = require('util');
const log = require('loglevel');

const timeout = 100; // TODO move this to some kind of configurable
const client = redis.createClient({host: 'redis', port: '6379'}); // TODO gracefully handle no redis
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
    log.debug(`cache hit for ${key}`);
    return JSON.parse(cache);
  }
  log.info(`cache miss for ${key}`);
  const response = await request;
  if (response) {
    const responseString = JSON.stringify(response);
    if (responseString) {
      client.setex(key, timeout, responseString);
    } else {
      log.warn(`"${response}" from "${key}" cannot be stringfy properly`);
    }
  } else {
    log.warn(`failed to fetch ${key} (probably)`);
  }
  return response;
}

module.exports = {
  getItem(id) {
    const key = `item_${id}`;
    const request = rq(generateOption(`/item/${id}.json`))
      .catch(err => log.debug(`failed to fetch ${key}: ${err}`));
    return redisOrRequest(key, request);
  },
  getUser(handle) {
    const key = `user_${handle}`;
    const request = rq(generateOption(`/user/${handle}.json`))
      .catch(err => log.debug(`failed to fetch ${key}: ${err}`));
    return redisOrRequest(key, request);
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
