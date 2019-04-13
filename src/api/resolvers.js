const { spawn } = require('child_process');
const loadHeartRateHistories = require('./loadHeartRateHistories');
const stepDate = (date,steps=1,freq=30000)=>new Date((+date||Date.parse(date))+steps*freq);

const data = {
  heartRateLists: loadHeartRateHistories()
};

// for generating errors with more helpful messages
// and to mask stack traces
// https://www.apollographql.com/docs/apollo-server/features/errors

// Resolvers define how to fetch the types in the schema.
// https://www.apollographql.com/docs/apollo-server/essentials/data#type-signature
const resolvers = {
  Query: {
    heartRateList: (parent, {id}={}, context, info) =>{
      return data.heartRateLists[id] ? [data.heartRateLists[id]] : [];
    },
    heartRatePredictions: (parent, {id=0, steps=3, model_id='default'}={}, context, info) =>{
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
    },
  }
};

module.exports = resolvers;
