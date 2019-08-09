const api = require('../api.js');
const response = require('../responses.js');
const { unixSecondToTime } = require('./utils.js');

async function getCommentByID(id) {
  const commentRes = await api.getItem(id);

  // TODO: this one seems like a bug from the API itself, not sure what I should do here
  if (commentRes == null) {
    throw `comment ${id} returns null`;
  }

  if (commentRes.type !== 'comment') {
    throw `${id} is not a comment, but a ${commentRes.type}`;
  }

  return new response.Comment(
    commentRes.id,
    new response.User(commentRes.by),
    commentRes.parent, // not sure how to deal with this
    commentRes.text,
    unixSecondToTime(commentRes.time),
    commentRes.kids.map(commentID => new response.Comment(commentID)),
  );
}

module.exports = {
  async timeByID(id) {
    const comment = await getCommentByID(id);
    return comment.time;
  },
  async userByID(id) {
    const comment = await getCommentByID(id);
    return comment.by;
  },
  async textByID(id) {
    const comment = await getCommentByID(id);
    return comment.text;
  },
};
