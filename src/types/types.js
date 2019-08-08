const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
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
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve: () => resolveTopStories(),
    },
    bestStories: {
      type: new GraphQLList(basicTypes.MaybeStoryType),
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve: () => resolveBestStories(),
    },
    newStories: {
      type: new GraphQLList(basicTypes.MaybeStoryType),
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
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
