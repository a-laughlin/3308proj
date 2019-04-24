const {readSleeps} = require('./datasource-apis/filesystem');
// once db implemented
// const {readSleeps} = require('./datasource-apis/sqlite');
const {readRatesPrediction} = require('./datasource-apis/ml');





// for generating errors with more helpful messages
// and to mask stack traces
// https://www.apollographql.com/docs/apollo-server/features/errors

// Resolvers define how to fetch the types in the schema.
// https://www.apollographql.com/docs/apollo-server/essentials/data#type-signature
const resolvers = {
  Query: {
    heartRateList: (parent, {id}={}, context, info) =>readSleeps().then(sleep=>sleep[id]),
    heartRatePredictions: (parent, {id=0, steps=3, model_id='ml_model_foo'}={}, context, info) =>{
      const stepDate = (date,steps=1,freq=30000)=> new Date((+date||Date.parse(date))+steps*freq);
      return readSleeps()
      .then(sleeps=>sleeps[id])
      .then(sleep=>{
        return readRatesPrediction({ rates:sleep.rates, steps, model_id })
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
