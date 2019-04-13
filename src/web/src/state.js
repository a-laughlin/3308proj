/* eslint-disable no-unused-vars */
import React,{createElement} from 'react';
import ApolloClient, { gql } from "apollo-boost";
import hr_history from './sample_data/ml_output_foo.json';
import {useObservable} from './hooks';
import {pipe,cond,renameProps,ife,isString} from './utils';




export const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

// client.defaultOptions

/** fetchPolicy https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/watchQueryOptions.ts#L10
 * fetchPolicy determines where the client may return a result from. The options are:
 * - cache-first (default): return result from cache. Only fetch from network if cached result is not available.
 * - cache-and-network: return result from cache first (if it exists), then return network result once it's available.
 * - cache-only: return result from cache if available, fail otherwise.
 * - no-cache: return result from network, fail if network call doesn't succeed, don't save to cache
 * - network-only: return result from network, fail if network call doesn't succeed, save to cache
 * - standby: only for queries that aren't actively watched, but should be available for refetch and updateQueries.
 */

/** errorPolicy https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/watchQueryOptions.ts#L27
 * errorPolicy determines the level of events for errors in the execution result. The options are:
 * - none (default): any errors from the request are treated like runtime errors and the observable is stopped (XXX this is default to lower breaking changes going from AC 1.0 => 2.0)
 * - ignore: errors from the request do not stop the observable, but also don't call `next`
 * - all: errors are treated like data and will notify observables
 */
client.defaultOptions = {
  // errorPolicy: ignore (no errors)|none(error or data)|all (errors and data)
  watchQuery: {fetchPolicy:'cache-first',errorPolicy:'none'},
  query: {fetchPolicy:'cache-first',errorPolicy:'none'},
  mutate: {fetchPolicy:'no-cache',errorPolicy:'none'}
};
client.writeData({data:{ // initial state
  heartRateListHistory:{},
  heartRateListPrediction:{},
}});
// networkStatus
// https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
// const mutations = {
//   'predictHeartRate(start,steps,freq)->heartRateList{id,end,rate}':gql`
//     mutation predictHeartRate($start: String!,$steps: Int!,$freq: Int!) {
//       predictHeartRate(start: $start,steps:$steps,freq: $freq) {id,end,rate}
//     }
//   `,
// };
const queries = {
  '{heartRateList{id,end,rate}}':gql`{heartRateList{id,end,rate}}`
}
// options from https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.watchQuery
export const getUseWatchQuery = (options={})=>{
  if (typeof options === 'string') options = {query:options};
  options={...options,query:(typeof options.query === 'string') ? gql(options.query) : options.query}
  const obs = client.watchQuery(options);
  const initial = {data:{},loading:true};
  return function useWatchQuery(p){
    const queryResult = useObservable(obs,initial);
    if(queryResult.loading) return 'loading';
    if(queryResult.error) return queryResult.error;
    return queryResult.data;
  }
}

const stepDate = (date,steps=1,freq=5000)=>new Date((+date||Date.parse(date))+steps*freq);

//
// export const predictHeartRates = (steps=10)=>p=>{
//   const query = gql`{ heartRateList{ id end rate } }`;
//   const data = client.readQuery({query});
//   console.log(`data`, data);
//   const {id,end,rate} = data.heartRateList[data.heartRateList.length-1];
//   client.mutate({
//     mutation:mutations['predictHeartRate(start,steps,freq)->heartRateList{id,end,rate}'],
//     variables:{start:end,steps,freq:5000}
//   })
//   .then(({data:{predictHeartRate:heartRateList}})=>{
//     client.writeQuery({query,data:{heartRateList}});
//   })
//   .catch((...args)=>{
//     console.log(`mutate.catch args`, args);
//   })
// }

export const isLoading = x=>x==='loading';
export const isError = x=> x instanceof Error;
export const isData = x=> !isLoading(x) && !isError(x);
export const useHeartRateQuery = variables=>getUseWatchQuery(
  {
    query:gql`query ($id: ID!,$steps:Int,$model_id: ID){
      heartRatePredictions (id: $id,steps:$steps,model_id:$model_id){
        id
        start
        rates
        history{
          rates
        }
      }
    }`,
    fetchPolicy:'cache-and-network',
    variables,
  }
);
