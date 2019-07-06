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
    return null; // TODO: is this how other people do it?
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
      resolve: (_, { id }) => {
        const output = new Story(id, 'test');
        return output;
      },
    },
    stories: {
      type: new GraphQLList(MaybeStoryType),
      // args: { }, //TODO: sortBy
      resolve: (_, args) => new Promise((resolve) => {
        api.getItem(8863, (err, resp, body) => {
          resolve([new Story(body.id)]);
        });
      }),
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
app.listen(4000);
// eslint-disable-next-line no-console
console.log('Running a GraphQL API server at localhost:4000/graphql');
