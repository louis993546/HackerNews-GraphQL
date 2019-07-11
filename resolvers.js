const api = require('./api.js');
const {
  Story, Comment, User, Time, Deleted,
} = require('./classes.js');

function unixSecondToTime(unixSeconds) {
  return new Time(
    unixSeconds,
    new Date(unixSeconds * 1000).toISOString(),
  );
}

function getStoryByID(id) {
  return api.getItem(id)
    .then((item) => {
      if (item.type !== 'story') {
        throw `${id} is not a story, but a ${item.type} instead`;
      } else {
        return item;
      }
    })
    .then((storyRes) => {
      if (storyRes.deleted == true) {
        return new Deleted(storyRes.id, 'story', unixSecondToTime(storyRes.time));
      }
      return new Story(
        storyRes.id,
        storyRes.title,
        unixSecondToTime(storyRes.time),
        storyRes.by,
        storyRes.kids,
      );
    });
}

function something(order) {
  switch (order) {
    case 'top': return api.getTopStories();
    case 'best': return api.getBestStories();
    case 'new': return api.getNewStories();
    default: throw `${order} is not a valid story order`;
  }
}

module.exports = {
  async resolveUserByHandle(handle) {
    const res = await api.getUser(handle);
    return new User(res.id, res.about, res.karma, res.delay, unixSecondToTime(res.created));
  },
  resolveCommentsById(commentIDs) {
    // TODO: somehow each comment should fetch their kids only when necessary
    return commentIDs.map(id => new Comment(id));
  },
  resolveStoryByID(id) {
    return getStoryByID(id);
  },
  resolveStoriesByOrder(order) {
    return something(order)
      .then((storiesID) => {
        const stories = storiesID.map(id => getStoryByID(id));
        return Promise.all(stories);
      });
  },
};
