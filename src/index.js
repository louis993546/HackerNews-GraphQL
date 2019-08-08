const express = require('express');
const graphqlHTTP = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const log = require('loglevel');
const { QueryType } = require('./types/types.js');
require('dotenv').config();

log.setLevel(process.env.LOG_LEVEL);

const schema = new GraphQLSchema({ query: QueryType });

const app = express();
const port = process.env.PORT;
if (port === undefined) throw 'PORT not found';
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, // TODO: disable for production build
  pretty: true, // TODO: disable for production build
}));
app.listen(port);
log.info(`Running a GraphQL API server at localhost:${port}/graphql`);
