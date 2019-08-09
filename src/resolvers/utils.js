const { Time } = require('../responses.js');

module.exports = {
  unixSecondToTime(unixSeconds) {
    return new Time(unixSeconds, new Date(unixSeconds * 1000).toISOString());
  },
};
