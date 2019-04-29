const { ApolloServer,gql } = require('apollo-server-express');
// const {readSleeps} = require('./datasource-apis/filesystem');
const {readSleeps} = require('./datasource-apis/sqlite');
const {readRatesPrediction} = require('./datasource-apis/ml');

// typeDefs define what the server can respond with
const typeDefs = gql`
  type HeartRateList {
    summary_date: ID!
    bedtime_start: String! # Local ISO String
    bedtime_end: String! # Local ISO String
    freq: Int! # Sample frequency in ms
    rates: [Int]! # sample heartrates
    prediction_model_id: String
    history: HeartRateList
  }

  # The "Query" type is the root of all GraphQL queries.
  type Query {
    # heartRateList(summary_date: ID): [HeartRateList]!
    heartRatePredictions(summary_date: ID, steps: Int, model_id: ID): [HeartRateList]!
  }

  # "Mutation" type defines operations that create/update/delete data
  # type Mutation {
  #   addPredictitonModel(summary_date: ID!): [HeartRateListPrediction]!
  # }
`;

// resolvers get the data for responses
const logAndThrow = (msg='')=>e=>{console.log('ERROR: '+msg);console.error(e); throw e;}
const resolvers = {
  Query: {
    // heartRateList: (parent, {summary_date}={}, context, info) =>readSleeps().then(sleep=>sleep[summary_date]),
    heartRatePredictions: (parent, {summary_date=0, steps=3, model_id='ml_model_foo'}={}, context, info) =>{
      return readSleeps()
      .catch(logAndThrow('resolvers.Query.heartRatePredictions.readSleeps'))
      .then(({[summary_date]:sleep})=>{
        if (!sleep) throw new Error(`No data for date ${summary_date}`);
        return readRatesPrediction({ rates:sleep.rates, steps, model_id })
        .catch(logAndThrow('resolvers.Query.heartRatePredictions.readSleeps.readRatesPrediction'))
        .then(rates=>[{
          // select a subset of the actual sleep data object to return as a prediction
          // // add any additional properties we need for classification here
          // // e.g.,
          // // score:sleep.score,
          summary_date:`${summary_date}_${model_id}`,
          bedtime_start:sleep.bedtime_end,
          bedtime_end:sleep.bedtime_end,
          history:sleep,
          freq:30000,
          rates:rates,
          prediction_model_id:model_id
        }])
      })
      .catch(logAndThrow('resolvers.Query.heartRatePredictions end'))
    }
  }
};

const server = new ApolloServer({
  introspection:true, // enable querying __schema to get the schema as json
  playground:true, // enable graphiql in production
  typeDefs,
  resolvers
});

module.exports = {server,typeDefs,resolvers};
