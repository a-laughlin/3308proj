/* eslint-disable no-unused-vars */
import React,{createElement} from 'react';
import ApolloClient, { gql } from "apollo-boost";
import hr_history from './sample_data/ml_output_foo.json';
import {useObservable} from './hooks';
import {pipe,cond,renameProps,ife,isString} from './utils';
// @client(always: true) ensures that a local resolver is always fired
// uri: "https://dog-graphql-api.glitch.me/graphql",


// resolvers: {
//   query:{
//     hr:()=>{
//       return initialState.hr
//     }
//   }
// }
export const client = new ApolloClient({
  typeDefs:gql`
    extend type Query {
      HeartRateList: [hr]!
    }
    extend type Mutation {
      HeartRateList: [hr]!
    }
    type hr {
      id: Int!
      freq: Int!
      start: Date!
      end: Date!
      beats: [Int]!
    }
  `,
});

// ensure we're using client data and throwing all errors
client.defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-only',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'cache-only',
    errorPolicy: 'all',
  },
  mutate: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
};
client.writeData({data:{ // initial state
  foo:1,
  hr:[{
    __typename:'hr',
    id:'0',
    freq:'5000',
    start:'2019-03-20T18:53:59-0600',
    end:'2019-03-20T18:57:15-0600',
    beats:hr_history.concat(hr_history).concat(hr_history)
  },
  {
    __typename:'hr',
    id:'1',
    freq:'5000',
    start:'2019-03-20T18:57:15-0600',
    end:'2019-03-20T18:57:48-0600',
    beats:hr_history
  },]
}});

const ensureGql = ife(isString,s=>gql(`${s}`));
// options from https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.watchQuery
export const getUseWatchQuery = (options={})=>{
  if (typeof options === 'string') options= {query:options};
  options={...options,query:ensureGql(options.query)}
  const obs = client.watchQuery(options);
  const initial = {data:client.readQuery(options),loading:false};
  return function useWatchQuery(p){
    const queryResult = useObservable(obs,initial);
    if(queryResult.loading) return 'loading';
    if(queryResult.error) return queryResult.error;
    return queryResult.data;
  }
}
export const mutate = (options={})=>{
  if (typeof options === 'string') options = {query:options};
  options = {...options,query:ensureGql(options.query)};//renameProps({mutation:'query'})(options)
  options.mutation = options.query;
  // delete options.query; // required for mutate
  return fn=>{
    client.writeQuery({...options,data:fn(client.readQuery(options))})
    // mutate is only for updating the server
    // debugger;
    // client.mutate({...options,update:fn})
  }
}

export const isLoading = x=>x==='loading';
export const isError = x=> x instanceof Error;
export const isData = x=> !isLoading(x) && !isError(x);
export const useHeartRateQuery = getUseWatchQuery({query:`query {hr @client {id @client,start @client,end @client,freq @client,beats @client}}`});
