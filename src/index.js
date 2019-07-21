const express = require('express');
const graphqlHTTP = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const log = require('loglevel');
const types = require('./types.js');
require('dotenv').config();

log.setLevel('debug');

const schema = new GraphQLSchema({
  query: types.QueryType,
  types: [
    types.MaybeStoryType,
    types.StoryType,
    types.CommentType,
    types.DeletedType,
    types.ItemType,
    types.UserType,
    types.StoryOrderType,
    types.TimeType,
    types.JobType,
  ],
});

const app = express();
const port = process.env.PORT;
if (port === undefined) throw 'PORT not found';
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(port);
log.info(`Running a GraphQL API server at localhost:${port}/graphql`);
