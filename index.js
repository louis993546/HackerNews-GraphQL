var express = require('express');
var graphqlHTTP = require('express-graphql');
var {
  GraphQLInterfaceType,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql');

class Story {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

class Deleted {
  constructor(id) {
    this.id = id
  }
}

var MaybeStoryType = new GraphQLInterfaceType({
  name: 'MaybeStory',
  fields: { id: { type: GraphQLID } },
})

var StoryType = new GraphQLObjectType({
  name: 'Story',
  interfaces: [MaybeStoryType],
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
  },
  isTypeOf: value => value instanceof Story
})

var DeletedType = new GraphQLObjectType({
  name: 'Deleted',
  interfaces: [MaybeStoryType],
  fields: { id: { type: GraphQLID } },
  isTypeOf: value => value instanceof Deleted
})

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    story: {
      type: MaybeStoryType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (_, { id }) => {
        var output = new Story(id, "test");
        console.log("Will return " + JSON.stringify(output));
        return output
      }
    }
  }
});

var schema = new GraphQLSchema({ 
  query: queryType,
  types: [ MaybeStoryType, StoryType, DeletedType ]
});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');