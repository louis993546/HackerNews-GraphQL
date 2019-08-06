const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
} = require('graphql');
const {
  resolveTopStories,
  resolveBestStories,
  resolveNewStories,
  resolveStoryByID,
  resolveUserByHandle,
  resolveJobs,
} = require('../resolvers/resolvers.js');
const basicTypes = require('./basicTypes.js');

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    topStories: {
      type: new GraphQLList(basicTypes.StoryListItemType),
      resolve: () => resolveTopStories(),
    },
    bestStories: {
      type: new GraphQLList(basicTypes.MaybeStoryType),
      resolve: () => resolveBestStories(),
    },
    newStories: {
      type: new GraphQLList(basicTypes.MaybeStoryType),
      resolve: () => resolveNewStories(),
    },
    story: {
      type: basicTypes.MaybeStoryType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => resolveStoryByID(id),
    },
    user: {
      type: basicTypes.UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => resolveUserByHandle(id),
    },
    jobs: {
      type: new GraphQLList(basicTypes.JobType),
      resolve: () => resolveJobs(),
    },
  }),
});

module.exports = {
  QueryType,
};
