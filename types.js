const {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
const {
  User, Deleted, Comment, Story, Time,
} = require('./classes.js');
const {
  resolveStoriesByOrder,
  resolveStoryByID,
  resolveUserByHandle,
  resolveCommentsByID,
  resolveItemByID,
} = require('./resolvers.js');

const TimeType = new GraphQLObjectType({
  name: 'Time',
  fields: {
    unix: { type: GraphQLInt },
    iso8601: { type: GraphQLString },
  },
  isTypeOf: value => value instanceof Time,
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    about: { type: GraphQLString },
    karma: { type: GraphQLInt },
    delay: { type: GraphQLInt },
    created: { type: TimeType },
    // TODO: submitted
  },
  isTypeOf: value => value instanceof User,
});

const ItemInterfaceType = new GraphQLInterfaceType({
  name: 'Item',
  fields: {
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: { type: UserType },
  },
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
  interfaces: [ItemInterfaceType],
  fields: {
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: { type: UserType },
    type: { type: ItemTypeType },
  },
  isTypeOf: value => value instanceof Deleted,
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [ItemInterfaceType],
  fields: {
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: {
      type: UserType,
      resolve: src => resolveUserByHandle(src.by),
    },
    parent: {
      type: ItemInterfaceType,
      resolve: src => resolveItemByID(src.parent),
    },
    text: { type: GraphQLString },
    kids: {
      type: new GraphQLList(ItemInterfaceType),
      description: 'Most if not all kids of a comment are also comments',
      resolve: src => resolveCommentsByID(src.kids),
    },
  },
  isTypeOf: value => value instanceof Comment,
});

const MaybeCommentType = new GraphQLUnionType({
  name: 'MaybeComment',
  types: [DeletedType, CommentType],
});

const StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [ItemInterfaceType],
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    time: { type: TimeType },
    by: {
      type: UserType,
      resolve: src => resolveUserByHandle(src.by),
    },
    comments: {
      type: new GraphQLList(MaybeCommentType),
      resolve: src => resolveCommentsByID(src.comments),
    },
  },
  isTypeOf: value => value instanceof Story,
});

const MaybeStoryType = new GraphQLUnionType({
  name: 'MaybeStory',
  types: [DeletedType, StoryType],
});

const StoryOrderType = new GraphQLEnumType({
  name: 'StoryOrder',
  values: {
    BEST: { value: 'best' },
    TOP: { value: 'top' },
    NEW: { value: 'new' },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    story: {
      type: MaybeStoryType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => resolveStoryByID(id),
    },
    stories: {
      type: new GraphQLList(MaybeStoryType),
      args: {
        order: { type: StoryOrderType },
      },
      resolve: (_, { order }) => resolveStoriesByOrder(order)
      ,
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => resolveUserByHandle(id),
    },
  },
});

module.exports = {
  QueryType,
  StoryType,
  MaybeStoryType,
  CommentType,
  MaybeCommentType,
  DeletedType,
  ItemType: ItemInterfaceType,
  UserType,
  StoryOrderType,
  TimeType,
};
