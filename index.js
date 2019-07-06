const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');
const api = require('./api.js');
require('dotenv').config();

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

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    story: {
      type: MaybeStoryType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => api
        .getItem(id)
        .then((item) => {
          if (item.type != 'story') {
            throw `${id} is not a story`;
          } else {
            return item;
          }
        })
        .then(item => new Story(item.id, item.title)),
    },
    stories: {
      type: new GraphQLList(MaybeStoryType),
      // args: { }, //TODO: sortBy
      resolve: (_, args) => api
        .getBestStories()
        .then(storiesID => Promise.all(storiesID.map(id => api.getItem(id).then(fullStory => new Story(fullStory.id, fullStory.title))))),
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  types: [MaybeStoryType, StoryType, DeletedType, ItemType],
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(process.env.PORT);
// eslint-disable-next-line no-console
console.log(`Running a GraphQL API server at localhost:${process.env.PORT}/graphql`);
