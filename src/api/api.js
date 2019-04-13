const { ApolloServer, gql } = require('apollo-server');
const fs = require("fs");
const { spawn } = require('child_process');
const stepDate = (date,steps=1,freq=30000)=>new Date((+date||Date.parse(date))+steps*freq);



function loadHeartRateHistories(heartRateLists){
  const heartRateListsLoc = "../web/src/sample_data/hr.json";
  try{
    return heartRateLists || require(heartRateListsLoc);
  } catch(e){
    const sleep = require('../web/src/sample_data/oura_2019-03-05T18-00-21.json').sleep;
    const heartRateLists = sleep.reduce((o,v,i)=>{
      o[i]={
        id:i,
        start:v.bedtime_start,
        end:v.bedtime_end,
        freq:30000,
        rates:v.hr_5min
      };
      return o;
    },{});

    fs.writeFile(heartRateListsLoc, JSON.stringify(heartRateLists), (err, data)=> {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
    return heartRateLists;
  }
}
const data = {};
data.heartRateLists = loadHeartRateHistories(data.heartRateLists);




// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # type HeartRate { # probably necessary in database, not in api
  #   id: ID!
  #   end: String!
  #   rate: Int!
  # }
  type HeartRateList {
    id: ID!
    start: String! # Local ISO String
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
  # type Mutation {
  #   predictHeartRate(hist_id: ID!, model_id: String!, model_version: String, model_type:String, num_rates: Int!, freq: Int!): [HeartRateListPrediction]!
  # }
`;


// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
// https://www.apollographql.com/docs/apollo-server/essentials/data#type-signature


const resolvers = {
  Query: {
    heartRateList: (parent, {id}={}, context, info) =>{
      return data.heartRateLists[id] ? [data.heartRateLists[id]] : [];
    },
    heartRatePredictions: (parent, {id=0, steps=3, model_id='default'}={}, context, info) =>{
      // if(m_ids[model_id][id]!==undefined)
      //   return m_ids[id][model_id];
      return new Promise((resolve,reject)=>{
        const list = data.heartRateLists[id]
        const prediction_id=`${id}_${model_id}`;
        const {stdout,stderr} = spawn('python3',[
          '../ml/predict.py',
          '--future', steps,
          `--input`, JSON.stringify(list.rates),
          // '--model',model_id,
          // api should either manage model locs, or hand that off to ml
          // depends on when/how/why we create new models. May vary if we add users
        ]);
        stderr.on('data', reject);
        stdout.on('data', rates=>{
          data.heartRateLists[prediction_id] = {
            ...list,
            id:`${id}_${model_id}`,
            start:stepDate(list.end,1).toISOString(),
            end:stepDate(list.end,steps+1).toISOString(),
            history:list,
            rates:JSON.parse(rates),
            prediction_model_id:model_id
          }
          resolve([data.heartRateLists[prediction_id]]);
        });
      });
      // if (id!==undefined){return data.heartRateLists[id] ? [data.heartRateLists[id]] : [];}
      // if (hist_id!==undefined){return (data.predictionIDsByHistID[hist_id]||[]).map(pid=>data.heartRateLists[pid]);}
      // if (model_id!==undefined){return (data.predictionIDsByModelID[model_id]||[]).map(pid=>data.heartRateLists[pid]);}
      // return Object.values(data.heartRateListPredictionModels)
      //   .find(m=>m.version===model_version && m.type===model_type)
      //   .flatMap(m=>predictionIDsByModelID[m.id])
      //   .map(pid=>data.heartRateLists[pid]);
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
