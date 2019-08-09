const api = require('../api.js');
const response = require('../responses.js');
const { unixSecondToTime } = require('./utils.js');

// // TODO rename this to "get top story item by id" or something like that
// async function getSomethingByID(id) {
//   const res = await api.getItem(id);
//   switch (res.type) {
//     case 'job':
//       if (res.deleted === true) {
//         return new response.Deleted(res.id, 'job', unixSecondToTime(res.time));
//       }
//       return new response.Job(
//         res.id,
//         res.by,
//         res.title,
//         res.text,
//         res.url,
//         res.score,
//         unixSecondToTime(res.time),
//       );
//     case 'story':
//       if (res.deleted === true) {
//         return new response.Deleted(
//           res.id,
//           'story',
//           unixSecondToTime(res.time),
//         );
//       }
//       return new response.Story(
//         res.id,
//         res.title,
//         unixSecondToTime(res.time),
//         res.by, // which is just the id at this point
//         res.kids, // which is just an array of id at this point
//       );
//     default:
//       throw `Got ${res.type} for ${id}, instead of job or story`;
//   }
// }

function getStoryIDsByOrder(order) {
  switch (order) {
    case 'top':
      return api.getTopStories();
    case 'best':
      return api.getBestStories();
    case 'new':
      return api.getNewStories();
    default:
      throw `${order} is not a valid story order`;
  }
}

async function resolveStoriesByOrder(order, limit, offset) {
  const storiesID = await getStoryIDsByOrder(order);
  const stories = storiesID
    .slice(offset, offset + limit)
    .map(id => new response.Story(id));
  return Promise.all(stories);
}

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
    commentRes.by,
    commentRes.parent,
    commentRes.text,
    unixSecondToTime(commentRes.time),
    commentRes.kids,
  );
}

async function getJobs(limit, offset) {
  const res = await api.getJobStories();
  return res.slice(offset, offset + limit).map(id => new response.Job(id));
}

async function getJobByID(id) {
  const res = await api.getItem(id);
  if (res.type !== 'job') {
    throw `${id}: the type is not a job, but a ${res.type}`;
  }

  return new response.Job(
    res.id,
    res.by,
    res.title,
    res.text,
    res.url,
    res.score,
    res.time,
  );
}

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
  async resolveCommentByID(id) {
    return getCommentByID(id);
  },
  async resolveCommentsByID(commentIDs, limit, offset) {
    if (commentIDs === undefined) {
      return Promise.resolve();
    }
    const comments = commentIDs
      .slice(offset, limit + offset)
      .map(id => getCommentByID(id));
    return Promise.all(comments);
  },
  async resolveStoryByID(id) {
    return getStoryByID(id);
  },
  async resolveTopStories(limit, offset) {
    return resolveStoriesByOrder('top', limit, offset);
  },
  async resolveBestStories(limit, offset) {
    return resolveStoriesByOrder('best', limit, offset);
  },
  async resolveNewStories(limit, offset) {
    return resolveStoriesByOrder('new', limit, offset);
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
        return new response.Story(
          res.id,
          res.title,
          res.time,
          res.by,
          res.comments,
        );
      case 'comment':
        return new response.Comment(
          res.id,
          res.by,
          res.parent,
          res.text,
          res.time,
          res.kids,
        );
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
  resolveJobs(limit, offset) {
    return getJobs(limit, offset);
  },
  async resolveJobByID(id) {
    const job = await getJobByID(id);
    job.time = unixSecondToTime(job.time);
    return job;
  },
};
