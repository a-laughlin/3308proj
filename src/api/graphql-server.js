const { ApolloServer,gql } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs, // define what api can respond with
  resolvers, // get data for responses
  introspection:true, // enable querying __schema to get the schema as json
  playground:true // enable graphiql in production
});
module.exports = server;
