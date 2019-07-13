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

function getStoryIDsByOrder(order) {
  switch (order) {
    case 'top': return api.getTopStories();
    case 'best': return api.getBestStories();
    case 'new': return api.getNewStories();
    default: throw `${order} is not a valid story order`;
  }
}

async function getCommentByID(id) {
  const commentRes = await api.getItem(id);
  
  //TODO: this one seems like a bug from the API itself, not sure what I should do here
  if (commentRes == null) {
    throw `comment ${id} returns null`;
  }

  if (commentRes.type != 'comment') {
    throw `${id} is not a comment, but a ${commentRes.type}`;
  }

  return new Comment(
    commentRes.id,
    commentRes.by,
    commentRes.parent,
    commentRes.text,
    unixSecondToTime(commentRes.time),
    commentRes.kids,
  );
}

module.exports = {
  async resolveUserByHandle(handle) {
    const res = await api.getUser(handle);
    return new User(res.id, res.about, res.karma, res.delay, unixSecondToTime(res.created));
  },
  resolveCommentsByID(commentIDs) {
    if (commentIDs === undefined) {
      return Promise.resolve();
    }
    const comments = commentIDs.map(id => getCommentByID(id));
    return Promise.all(comments);
  },
  resolveStoryByID(id) {
    return getStoryByID(id);
  },
  async resolveStoriesByOrder(order) {
    const storiesID = await getStoryIDsByOrder(order);
    const stories = storiesID.map(id => getStoryByID(id));
    return Promise.all(stories);
  },
  async resolveItemByID(id) {
    const res = await api.getItem(id);
    switch (res.type) {
      case 'story':
        return new Story(res.id, res.title, res.time, res.by, res.comments);
      case 'comment':
        return new Comment(res.id, res.by, res.parent, res.text, res.time, res.kids);
      case 'pollopt':
        throw 'TODO';
      case 'poll':
        throw 'TODO';
      case 'job':
        throw 'TODO';
      default:
        throw `Do not understand what type ${res.type} is`;
    }
  },
};
