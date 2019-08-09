const api = require('../api.js');
const response = require('../responses.js');
const { unixSecondToTime } = require('./utils.js');

async function resolveUserByHandle(handle) {
  const res = await api.getUser(handle);
  return new response.User(
    res.id,
    res.about,
    res.karma,
    res.delay,
    unixSecondToTime(res.created),
    res.submitted,
  );
}

module.exports = {
  async userByID(id) {
    return new response.User(id);
  },
  async userAboutByID(id) {
    const res = await resolveUserByHandle(id);
    return res.about;
  },
  async userKarmaByID(id) {
    const res = await resolveUserByHandle(id);
    return res.karma;
  },
  async userDelayByID(id) {
    const res = await resolveUserByHandle(id);
    return res.delay;
  },
  async userCreatedByID(id) {
    const res = await resolveUserByHandle(id);
    return res.created;
  },
};
