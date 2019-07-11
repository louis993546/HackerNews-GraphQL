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
  resolveCommentsById,
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
  },
  isTypeOf: value => value instanceof User,
});

const ItemType = new GraphQLInterfaceType({
  name: 'Item',
  fields: {
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: { type: UserType },
  },
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [ItemType],
  fields: {
    id: { type: GraphQLID },
    time: { type: TimeType },
    by: {
      type: UserType,
      resolve: src => resolveUserByHandle(src.by),
    },
    parent: {
      type: ItemType,
      resolve: () => new Story('fake', 'fake', 'fake', 123),
    },
    text: { type: GraphQLString },
    kids: {
      type: new GraphQLList(ItemType),
      description: 'Most if not all kids of a comment are also comments',
    },
  },
  isTypeOf: value => value instanceof Comment,
});

const StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [ItemType],
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    time: { type: TimeType },
    by: {
      type: UserType,
      resolve: src => resolveUserByHandle(src.by),
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: src => resolveCommentsById(src.comments),
    },
  },
  isTypeOf: value => value instanceof Story,
});

const DeletedType = new GraphQLObjectType({
  name: 'Deleted',
  fields: { id: { type: GraphQLID } },
  isTypeOf: value => value instanceof Deleted,
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
  MaybeStoryType,
  StoryType,
  CommentType,
  DeletedType,
  ItemType,
  UserType,
  StoryOrderType,
  TimeType,
};
