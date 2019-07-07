const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');
const log = require('loglevel');
const api = require('./api.js');
require('dotenv').config();

log.setLevel('debug');

class Story {
  constructor(id, title, time, by) {
    this.id = id;
    this.title = title;
    this.time = time;
    this.by = by;
  }
}

class Deleted {
  constructor(id, type, time) {
    this.id = id;
    this.type = type;
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

const StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [ItemType],
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    time: { type: GraphQLString }, // TODO: it should be a time
    by: {
      type: UserType,
      resolve: (src, args) => new User('test', 'test', 1, 1), // TODO call api accordingly
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

function resolveUserByHandle(handle) {
  return api.getUser(handle)
    .then(res => new User(res.id, res.about, res.karma, res.delay));
}

function resolveStoryByID(id) {
  return api.getItem(id)
    .then((item) => {
      if (item.type !== 'story') {
        throw `${id} is not a story`;
      } else {
        return item;
      }
    })
    .then(storyRes => new Story(storyRes.id, storyRes.title, storyRes.time));
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
      // args: { }, //TODO: sortBy
      resolve: (_, args) => resolveStoriesByOrder('best')
      ,
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  types: [MaybeStoryType, StoryType, DeletedType, ItemType, UserType],
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(process.env.PORT);
log.info(`Running a GraphQL API server at localhost:${process.env.PORT}/graphql`);
