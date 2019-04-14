const fs = require('./datasource-apis/filesystem');
const ml = require('./datasource-apis/ml');
const db = require('./datasource-apis/sqlite');


// for generating errors with more helpful messages
// and to mask stack traces
// https://www.apollographql.com/docs/apollo-server/features/errors

// Resolvers define how to fetch the types in the schema.
// https://www.apollographql.com/docs/apollo-server/essentials/data#type-signature
const resolvers = {
  Query: {
    heartRateList: (parent, {id}={}, context, info) =>fs.readSleeps().then(sleep=>sleep[id]),
    heartRatePredictions: (parent, {id=0, steps=3, model_id='default'}={}, context, info) =>{
      const stepDate = (date,steps=1,freq=30000)=> new Date((+date||Date.parse(date))+steps*freq);
      return fs.readSleeps()
      .then(sleeps=>sleeps[id])
      .then(sleep=>{
        return ml.readRatesPrediction({rates:sleep.rates,steps})
        .then(rates=>[{
          // select a subset of the actual sleep data object to return as a prediction
          // // add any additional properties we need for classification here
          // // e.g.,
          // // score:sleep.score,
          id:`${id}_${model_id}`,
          start:stepDate(sleep.end,1).toISOString(),
          end:stepDate(sleep.end,steps+1).toISOString(),
          history:sleep,
          freq:30000,
          rates:rates,
          prediction_model_id:model_id
        }]);
      })
    }
  }
};

module.exports = resolvers;
