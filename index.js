const express = require('express');
const graphqlHTTP = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const log = require('loglevel');
const {
  QueryType,
  MaybeStoryType,
  StoryType,
  CommentType,
  DeletedType,
  ItemType,
  UserType,
  StoryOrderType,
} = require('./types.js');
require('dotenv').config();

log.setLevel('debug');

const schema = new GraphQLSchema({
  query: QueryType,
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
