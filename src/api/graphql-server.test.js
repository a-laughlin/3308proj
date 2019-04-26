const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server-express');
const server = require('./graphql-server');

// we don't need to create a test version of the server or mock outside data
// sources since our implementation is simple
// unless we wanted to test prediction responses without calling the ML piece
// for more info https://www.apollographql.com/docs/apollo-server/features/testing

it('queries nested heartRatePredictions', async () => {
  // create query/mutate fns for the server for the server
  const { query/*, mutate*/ } = createTestClient(server);

  // run query against the server and snapshot the output
  const result = await query({
    query: gql`query ($summary_date: ID!,$steps:Int,$model_id: ID){
      heartRatePredictions (summary_date: $summary_date, steps: $steps, model_id: $model_id){
        summary_date
        bedtime_start
        bedtime_end
        freq
        rates
        prediction_model_id
        history{
          summary_date
          bedtime_start
          bedtime_end
          freq
          rates
          prediction_model_id
        }
      }
    }`,
    variables: { summary_date: "2018-11-05", steps:10 }
  });
  expect(result).toMatchSnapshot();
});
