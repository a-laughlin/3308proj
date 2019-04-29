import React,{createElement} from 'react';
import ApolloClient, { gql } from "apollo-boost";
import {useObservable} from './hooks';
import {pipe,cond,renameProps,ife,isString} from './utils';
// import {envs} from '../../../envs';
/**
 * the Apollo client handles data caching+exchange with the Apollo graphql server
 */
export {gql};

export const uri = process.env.NODE_ENV==='production'?
  '/graphql' :
  'http://localhost:4000/graphql';

export const client = new ApolloClient({uri});

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

/* Initial State */
client.writeData({data:{}})

/** networkStatus from query responses
 * https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
 */
// options from https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.watchQuery
export const getUseWatchQuery = (options={})=>{
  const obs = client.watchQuery(options);
  return function useWatchQuery(props){return useObservable(obs,{data:{},loading:true});}
}

export const isLoading = x=>x.loading;
export const isError = x=>x.errors && x.errors.length;
export const isData = x=>!isLoading(x) && !isError(x);

export const useHeartRateQuery = variables=>getUseWatchQuery({
  query:gql`query ($summary_date: ID!,$steps:Int,$model_id: ID){
    heartRatePredictions (summary_date: $summary_date,steps:$steps,model_id:$model_id){
      summary_date
      bedtime_start
      rates
      history{
        rates
      }
    }
  }`,
  variables,
});
