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
const api = require('./api.js');
require('dotenv').config();

log.setLevel('debug');

class Story {
  constructor(id, title, time, by, comments) {
    this.id = id;
    this.title = title;
    this.time = time;
    this.by = by;
    this.comments = comments;
  }
}

class Deleted {
  constructor(id, type, time) {
    this.id = id;
    this.type = type;
    this.time = time;
  }
}

class Comment {
  constructor(id, by, parent, text, time) {
    this.id = id;
    this.by = by;
    this.parent = parent;
    this.text = text;
    this.time = time;
  }
}

class User {
  constructor(id, about, karma, delay) {
    this.id = id;
    this.about = about;
    this.karma = karma;
    this.delay = delay;
  }
}

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

function resolveUserByHandle(handle) {
  return api.getUser(handle)
    .then(res => new User(res.id, res.about, res.karma, res.delay));
}

function resolveCommentsById(commentIDs) {
  return commentIDs.map(id => new Comment(id)); // TODO: somehow each comment should fetch their kids only when necessary
}

function resolveStoryByID(id) {
  return api.getItem(id)
    .then((item) => { if (item.type !== 'story') { throw `${id} is not a story`; } else { return item; } })
    .then(storyRes => new Story(storyRes.id, storyRes.title, storyRes.time, storyRes.by, storyRes.kids));
}

function something(order) {
  switch (order) {
    case 'top': return api.getTopStories();
    case 'best': return api.getBestStories();
    case 'new': return api.getNewStories();
    default: throw `${order} is not a valid story order`;
  }
}

function resolveStoriesByOrder(order) {
  return something(order)
    .then((storiesID) => {
      const stories = storiesID.map(id => resolveStoryByID(id));
      return Promise.all(stories);
    });
}

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
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(process.env.PORT);
log.info(`Running a GraphQL API server at localhost:${process.env.PORT}/graphql`);
