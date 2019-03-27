const { ApolloServer, gql } = require('apollo-server');
hr_history  = require('../web/src/sample_data/ml_output_foo.json');
const { spawn } = require('child_process');
// /web/src/sample_data/oura_2019-03-05T18-00-21.json
const data = {
  heartRateList:hr_history.map((v,i)=>{
    return {id:i,end:(new Date( 1553569207439 + i*5000 )).toISOString(),rate:v}
  })
}
// benefits

// Custom Scalar Date

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type HeartRate {
    id: ID!
    end: String!
    rate: Int!
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    heartRateList(start: String, end: String): [HeartRate]
  }
  type Mutation {
    predictHeartRate(start: String!, steps: Int!, freq:Int!): [HeartRate!]!
  }
`;


// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
// https://www.apollographql.com/docs/apollo-server/essentials/data#type-signature

const resolvers = {
  Query: {
    heartRateList: (parent, args, context, info) => {
      return data.heartRateList.slice(
        args.start ? data.heartRateList.findIndex(args.start) : 0,
        args.end   ? data.heartRateList.findIndex(args.end)   :-1
      );
    }
  },
  Mutation: {
    predictHeartRate: (parent,{steps,start,freq=5000}={},context,info)=>new Promise(function(resolve, reject) {
      let {id} = data.heartRateList.find(hr=>hr.end===start);
      let startStamp = Date.parse(start);
      let endStamp = startStamp + freq + steps * freq;
      while((startStamp+=freq)<endStamp){
        ++id
        data.heartRateList[id]={id,end:(new Date(startStamp)).toISOString(),rate:50};
      }
      resolve(data.heartRateList);
      // in python
      // sys.stdout.flush()
      // const {stdout,stderr} = spawn('python3', ['../ml/ml_utils.py',JSON.stringify({start,steps,freq})]);
      // stdout.on('data', resolve);
      // stderr.on('data', reject);
    })
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
