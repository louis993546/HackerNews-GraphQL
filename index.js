const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLInterfaceType,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql');

class Story {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

class Deleted {
  constructor(id) {
    this.id = id;
  }
}

const MaybeStoryType = new GraphQLInterfaceType({
  name: 'MaybeStory',
  fields: { id: { type: GraphQLID } },
});

const StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [MaybeStoryType],
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
  },
  isTypeOf: value => value instanceof Story,
});

const DeletedType = new GraphQLObjectType({
  name: 'Deleted',
  interfaces: [MaybeStoryType],
  fields: { id: { type: GraphQLID } },
  isTypeOf: value => value instanceof Deleted,
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
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  types: [MaybeStoryType, StoryType, DeletedType],
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(4000);
// eslint-disable-next-line no-console
console.log('Running a GraphQL API server at localhost:4000/graphql');
