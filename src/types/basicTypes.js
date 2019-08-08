const {
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
const response = require('../responses.js');
const {
  resolveStoryByID,
  resolveUserByHandle,
  resolveCommentsByID,
  resolveItemByID,
  resolveJobByID,
} = require('../resolvers/resolvers.js');

/**
 * Almost everything is an Item (except User), and they share a few common
 * fields
 */
const ItemType = new GraphQLInterfaceType({
  name: 'Item',
  fields: () => ({
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: { type: UserType },
  }),
});

/**
 * A more flexible representation of time
 */
const TimeType = new GraphQLObjectType({
  name: 'Time',
  fields: {
    unix: { type: GraphQLInt },
    iso8601: { type: GraphQLString },
  },
  isTypeOf: value => value instanceof response.Time,
});

/**
 * Pretty self-explainatory
 */
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    about: { type: GraphQLString },
    karma: { type: GraphQLInt },
    delay: { type: GraphQLInt },
    created: { type: TimeType },
    submitted: {
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      // TODO custom resolver
      type: new GraphQLList(ItemType),
    },
  }),
  isTypeOf: value => value instanceof response.User,
});

const StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [ItemType],
  fields: () => ({
    id: { type: GraphQLID },
    title: {
      type: GraphQLString,
      resolve: async (src) => {
        const story = await resolveStoryByID(src.id);
        return story.title;
      },
    },
    time: {
      type: TimeType,
      resolve: async (src) => {
        const story = await resolveStoryByID(src.id);
        return story.time; // TODO map to time
      },
    },
    by: {
      type: UserType,
      resolve: src => resolveUserByHandle(src.by),
    },
    comments: {
      // eslint-disable-next-line no-use-before-define
      type: new GraphQLList(MaybeCommentType),
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      // TODO use arguments
      resolve: src => resolveCommentsByID(src.comments),
    },
  }),
  isTypeOf: value => value instanceof response.Story,
});

const ItemTypeType = new GraphQLEnumType({
  name: 'ItemType',
  values: {
    STORY: { value: 'story' },
    COMMENT: { value: 'comment' },
  },
});

const DeletedType = new GraphQLObjectType({
  name: 'Deleted',
  interfaces: [ItemType],
  fields: () => ({
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: { type: UserType },
    type: { type: ItemTypeType },
  }),
  isTypeOf: value => value instanceof response.Deleted,
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [ItemType],
  fields: () => ({
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: {
      type: UserType,
      resolve: src => resolveUserByHandle(src.by),
    },
    parent: {
      type: ItemType,
      resolve: src => resolveItemByID(src.parent),
    },
    text: { type: GraphQLString },
    comments: {
      // eslint-disable-next-line no-use-before-define
      type: new GraphQLList(MaybeCommentType),
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      // TODO use arguments
      resolve: src => resolveCommentsByID(src.kids),
    },
  }),
  isTypeOf: value => value instanceof response.Comment,
});

const JobType = new GraphQLObjectType({
  name: 'Job',
  interfaces: [ItemType],
  fields: () => ({
    id: { type: GraphQLID },
    time: {
      type: TimeType,
      resolve: async (src) => {
        const job = await resolveJobByID(src.id);
        return job.time;
      },
    },
    by: {
      type: UserType,
      resolve: async (src) => {
        const job = await resolveJobByID(src.id);
        return resolveUserByHandle(job.by);
      },
    },
    score: {
      type: GraphQLInt,
      resolve: async (src) => {
        const job = await resolveJobByID(src.id);
        return job.score;
      },
    },
    title: {
      type: GraphQLString,
      resolve: async (src) => {
        const job = await resolveJobByID(src.id);
        return job.title;
      },
    },
    text: {
      type: GraphQLString,
      resolve: async (src) => {
        const job = await resolveJobByID(src.id);
        return job.text;
      },
    },
    url: {
      type: GraphQLString,
      resolve: async (src) => {
        const job = await resolveJobByID(src.id);
        return job.url;
      },
    },
  }),
  isTypeOf: value => value instanceof response.Job,
});

const StoryOrderType = new GraphQLEnumType({
  name: 'StoryOrder',
  values: {
    BEST: { value: 'best' },
    TOP: { value: 'top' },
    NEW: { value: 'new' },
  },
});

const MaybeStoryType = new GraphQLUnionType({
  name: 'MaybeStory',
  types: () => [DeletedType, StoryType],
});

const MaybeCommentType = new GraphQLUnionType({
  name: 'MaybeComment',
  types: () => [DeletedType, CommentType],
});

const StoryListItemType = new GraphQLUnionType({
  name: 'StoryListItem',
  types: () => [DeletedType, StoryType, JobType],
});

module.exports = {
  StoryType,
  CommentType,
  DeletedType,
  ItemType,
  UserType,
  TimeType,
  JobType,
  StoryOrderType,
  MaybeStoryType,
  MaybeCommentType,
  StoryListItemType,
};
