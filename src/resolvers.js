const api = require('./api.js');
const {
  Story, Comment, User, Time, Deleted, Job,
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

// TODO rename this
function getSomethingByID(id) {
  return api.getItem(id)
    .then((res) => {
      switch (res.type) {
        case 'job':
          if (res.deleted === true) {
            return new Deleted(res.id, 'job', unixSecondToTime(res.time));
          }
          return new Job(res.id, res.by, res.title, res.text, res.url, res.score, unixSecondToTime(res.time));

        case 'story':
          if (res.deleted === true) {
            return new Deleted(res.id, 'story', unixSecondToTime(res.time));
          }
          return new Story(
            res.id,
            res.title,
            unixSecondToTime(res.time),
            res.by,
            res.kids,
          );
        default:
          throw `Got ${res.type} for ${id}, instead of job or story`;
      }
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

async function resolveStoriesByOrder(order) {
  const storiesID = await getStoryIDsByOrder(order);
  const stories = storiesID.map(id => getSomethingByID(id));
  return Promise.all(stories);
}

async function getCommentByID(id) {
  const commentRes = await api.getItem(id);

  // TODO: this one seems like a bug from the API itself, not sure what I should do here
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

async function getJobs() {
  const res = await api.getJobStories();
  return res.map(id => new Job(id));
}

async function getJobByID(id) {
  const res = await api.getItem(id);
  if (res.type != 'job') {
    throw `${id}: the type is not a job, but a ${res.type}`;
  }

  return new Job(
    res.id,
    res.by,
    res.title,
    res.text,
    res.url,
    res.score,
    res.time,
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

  async resolveTopStories() {
    return resolveStoriesByOrder('top');
  },
  async resolveBestStories() {
    return resolveStoriesByOrder('best');
  },
  async resolveNewStories() {
    return resolveStoriesByOrder('new');
  },
  // async resolveAsks() {
  //   throw 'TODO'
  // },
  // async resolveJobs() {
  //   throw 'TODO'
  // },
  // async resolveShows() {
  //   throw 'TODO'
  // },
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
  resolveJobs() {
    return getJobs();
  },
  async resolveJobByID(id) {
    const job = await getJobByID(id);
    job.time = unixSecondToTime(job.time);
    return job;
  },
};
