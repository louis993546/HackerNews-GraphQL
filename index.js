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
  constructor(id, title) {
    this.id = id;
    this.title = title;
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
});

const ItemType = new GraphQLInterfaceType({
  name: 'Item',
  fields: {
    id: { type: GraphQLID },
    type: { type: GraphQLString }, // TODO: it should be an enum
    time: { type: GraphQLString }, // TODO: it should be a time
    by: { type: GraphQLString }, // TODO: it should be a user
  },
});

const StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [ItemType],
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    type: { type: GraphQLString }, // TODO: it should be an enum
    time: { type: GraphQLString }, // TODO: it should be a time
    by: { type: GraphQLString }, // TODO: it should be a user
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


// all the resolves that i should need
// id -> story
// top/best/newest stories -> list of stories

function resolveStoryByID(id) {
  return api.getItem(id)
    .then((item) => {
      if (item.type !== 'story') {
        throw `${id} is not a story`;
      } else {
        return item;
      }
    })
    .then(item => new Story(item.id, item.title));
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
