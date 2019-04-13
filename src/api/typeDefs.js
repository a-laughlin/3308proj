const { gql } = require('apollo-server');
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type HeartRateList {
    id: ID!
    start: String! # Local ISO String
    end: String! # Local ISO String
    freq: Int! # Sample frequency in ms
    rates: [Int]! # sample heartrates
    prediction_model_id: String
    history: HeartRateList
  }

  # The "Query" type is the root of all GraphQL queries.
  type Query {
    heartRateList(id: ID): [HeartRateList]!
    heartRatePredictions(id: ID, steps: Int, model_id: ID): [HeartRateList]!
  }

  # "Mutation" type defines operations that create/update/delete data
  # type Mutation {
  #   addPredictitonModel(id: ID!): [HeartRateListPrediction]!
  # }
`;

module.exports = typeDefs
