const { ApolloServer, gql } = require('apollo-server');
const fs = require("fs");
const { spawn } = require('child_process');

const data = {
  // loaded from files
  heartRateLists:undefined,
  // loaded from files
  heartRateListPredictionModels:{
    '0':{id:'0',type:'RNN',version:'0.0.0',file_loc:'',accuracy:.96},
    '1':{id:'1',type:'LSTM',version:'0.0.0',file_loc:'',accuracy:.97},
  },
  // db join table
  histIDsByPredictionID:{},// {'0':[1,2,3]}
  histIDsByModelID:{},
  predictionIDsByModelID:{},
  predictionIDsByHistID:{},
  modelIDsByPredictionID:{},
  modelIDsByHistID:{},
};

// tables
// heartrates
// heartrateLists
// predictions[heartRateListID, fk heartRateListID, fk modelID] (0-n)

const loadHeartRateHistories = ()=>{
  if(data.heartRateLists){
    return data.heartRateLists;
  }
  const heartRateListsLoc = "../web/src/sample_data/hr.json";
  try{
    return (data.heartRateLists = require(heartRateListsLoc));
  } catch(e){
    const sleep = require('../web/src/sample_data/oura_2019-03-05T18-00-21.json').sleep;
    data.heartRateLists = sleep.reduce((o,v,i)=>{
      o[i]={
        id:i,
        start:v.bedtime_start,
        end:v.bedtime_end,
        freq:30000,
        rates:v.hr_5min
      };
      return o;
    },{});

    fs.writeFile(heartRateListsLoc, JSON.stringify(data.heartRateLists), (err, data)=> {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
    return data.heartRateLists;
  }
}
loadHeartRateHistories()

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # type HeartRate { # necessary in database, but not in api
  #   id: ID!
  #   end: String!
  #   rate: Int!
  # }
  type HeartRateListPredictionModel {
    id: ID!
    type: String!
    version: String!
    accuracy: Float!
    training_lists: [HeartRateListHistory]
    predictions: [HeartRateListPrediction]
  }

  interface HeartRateList {
    id: ID!
    start: String! # Local ISO String
    end: String! # Local ISO String
    freq: Int! # Sample frequency in ms
    rates: [Int]! # sample heartrates
  }

  type HeartRateListHistory implements HeartRateList {
    id: ID!
    start: String! # Local ISO String
    end: String! # Local ISO String
    freq: Int! # Sample frequency in ms
    rates: [Int]! # sample heartrates
    predictions:[HeartRateListPrediction]!
  }

  type HeartRateListPrediction implements HeartRateList {
    id: ID!
    start: String! # Local ISO String
    end: String! # Local ISO String
    freq: Int! # Sample frequency in ms
    rates: [Int]! # sample heartrates
    model: HeartRateListPredictionModel!
    history: HeartRateListHistory! # one prediction has one history
  }

  # The "Query" type is the root of all GraphQL queries.
  type Query {
    heartRateListHistory(id: ID): [HeartRateListHistory]!
    heartRateListPrediction(pred_id: ID, hist_id: ID): [HeartRateListPrediction]!
  }
  # type Mutation {
  #   predictHeartRate(hist_id: ID!, model_id: String!, model_version: String, model_type:String, num_rates: Int!, freq: Int!): [HeartRateListPrediction]!
  # }
`;


// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
// https://www.apollographql.com/docs/apollo-server/essentials/data#type-signature

const resolvers = {
  Query: {
    heartRateListHistory: (parent, {id, pred_id, model_id, model_version, model_type}={}, context, info) =>{
      if (id!==undefined){return data.heartRateLists[id] ? [data.heartRateLists[id]] : [];}
      if (pred_id!==undefined){return (data.histIDsByPredictionID[pred_id]||[]).map(hid=>data.heartRateLists[hid]);}
      if (model_id!==undefined){return (data.histIDsByModelID[model_id]||[]).map(hid=>data.heartRateLists[hid]);}
      return Object.values(data.heartRateListPredictionModels)
        .find(m=>m.version===model_version && m.type===model_type)
        .flatMap(m=>predictionIDsByModelID[m.id])
        .map(pid=>data.heartRateLists[pid]);
    },
    heartRateListPrediction: (parent, {id, hist_id, model_id, model_version, model_type}={}, context, info) =>{
      if (id!==undefined){return data.heartRateLists[id] ? [data.heartRateLists[id]] : [];}
      if (hist_id!==undefined){return (data.predictionIDsByHistID[hist_id]||[]).map(pid=>data.heartRateLists[pid]);}
      if (model_id!==undefined){return (data.predictionIDsByModelID[model_id]||[]).map(pid=>data.heartRateLists[pid]);}
      return Object.values(data.heartRateListPredictionModels)
        .find(m=>m.version===model_version && m.type===model_type)
        .flatMap(m=>predictionIDsByModelID[m.id])
        .map(pid=>data.heartRateLists[pid]);
    },
  },
  // Mutation: {
  //   // hist_id: ID!, model_id: ID, model_version: String, model_type:String, num_rates: Int!, freq: Int!
  //   predictHeartRate: (parent,{id,rates=3,freq=30000}={},context,info)=>new Promise(function(resolve, reject) {
  //     // data.heartRatePredictionLists || (data.heartRatePredictionListsById[id] = {});
  //     // data.heartRatePredictionLists
  //     // .rates.slice(0,hist_steps).map(r=>r.rate);
  //     // const rates = data.heartRateListsById[id].rates.slice(0,hist_steps).map(r=>r.rate);
  //     // in python
  //     // sys.stdout.flush()
  //     // const {stdout,stderr} = spawn('python3', ['../ml/ml_utils.py',JSON.stringify({start,steps,freq})]);
  //     // stdout.on('data', resolve);
  //     // stderr.on('data', reject);
  //   })
  // },
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
