const api = require('./api.js');
const {
  Story, Comment, User, Time,
} = require('./classes.js');

function something(order) {
  switch (order) {
    case 'top': return api.getTopStories();
    case 'best': return api.getBestStories();
    case 'new': return api.getNewStories();
    default: throw `${order} is not a valid story order`;
  }
}

function unixSecondToTime(unixSeconds) {
  return new Time(
    unixSeconds,
    new Date(unixSeconds * 1000).toISOString(),
  );
}

module.exports = {
  async resolveUserByHandle(handle) {
    const res = await api.getUser(handle);
    return new User(res.id, res.about, res.karma, res.delay);
  },
  resolveCommentsById(commentIDs) {
    // TODO: somehow each comment should fetch their kids only when necessary
    return commentIDs.map(id => new Comment(id));
  },
  resolveStoryByID(id) {
    return api.getItem(id)
      .then((item) => { if (item.type !== 'story') { throw `${id} is not a story`; } else { return item; } })
      .then(storyRes => new Story(
        storyRes.id,
        storyRes.title,
        unixSecondToTime(storyRes.time),
        storyRes.by,
        storyRes.kids,
      ));
  },
  resolveStoriesByOrder(order) {
    return something(order)
      .then((storiesID) => {
        const stories = storiesID.map(id => resolveStoryByID(id));
        return Promise.all(stories);
      });
  },
};
