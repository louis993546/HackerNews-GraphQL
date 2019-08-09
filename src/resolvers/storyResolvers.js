const api = require('../api.js');
const response = require('../responses.js');
const { unixSecondToTime } = require('./utils.js');

async function getStoryByID(id) {
  const res = await api.getItem(id);
  if (res.type !== 'story') {
    throw `${id} is not a story, but a ${res.type} instead`;
  }

  return new response.Story(
    res.id,
    res.title,
    unixSecondToTime(res.time),
    new response.User(res.by),
    res.kids.map(commentID => new response.Comment(commentID)),
  );
}

module.exports = {
  async storyByID(id) {
    return new response.Story(id);
  },
  async titleByID(id) {
    const res = await getStoryByID(id);
    return res.title;
  },
  async timeByID(id) {
    const res = await getStoryByID(id);
    return res.time;
  },
  async userByID(id) {
    const res = await getStoryByID(id);
    return res.by;
  },
  async commentsByID(id, limit, offset) {
    const story = await getStoryByID(id);
    return story.comments.slice(offset, offset + limit);
  },
};
