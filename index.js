const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');
const log = require('loglevel');
const {
  resolveStoriesByOrder,
  resolveStoryByID,
  resolveUserByHandle,
  resolveCommentsById,
} = require('./resolvers.js');
const {
  Story,
  Deleted,
  Comment,
  User,
} = require('./classes.js');
require('dotenv').config();

log.setLevel('debug');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    about: { type: GraphQLString },
    karma: { type: GraphQLInt },
    delay: { type: GraphQLInt },
  },
  isTypeOf: value => value instanceof User,
});

const ItemType = new GraphQLInterfaceType({
  name: 'Item',
  fields: {
    id: { type: GraphQLID },
    time: { type: GraphQLString }, // TODO: it should be a time
    by: { type: UserType },
  },
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [ItemType],
  fields: {
    id: { type: GraphQLID },
    time: { type: GraphQLString }, // TODO: it should be a time
    by: {
      type: UserType,
      resolve: src => resolveUserByHandle(src.by),
    },
    parent: {
      type: ItemType,
      resolve: () => new Story('fake', 'fake', 'fake', 123),
    },
    text: { type: GraphQLString },
  },
  isTypeOf: value => value instanceof Comment,
});

const StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [ItemType],
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    time: { type: GraphQLString }, // TODO: it should be a time
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
  resolveType(value) {
    if (value instanceof Story) {
      return StoryType;
    }
    if (value instanceof Deleted) {
      return DeletedType;
    }
  },
});

const StoryOrderType = new GraphQLEnumType({
  name: 'StoryOrder',
  values: {
    BEST: { value: 'best' },
    TOP: { value: 'top' },
    NEW: { value: 'new' },
  },
});

const queryType = new GraphQLObjectType({
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
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  types: [
    MaybeStoryType,
    StoryType,
    CommentType,
    DeletedType,
    ItemType,
    UserType,
    StoryOrderType,
  ],
});

const app = express();
const port = process.env.PORT;
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(port);
log.info(`Running a GraphQL API server at localhost:${port}/graphql`);
