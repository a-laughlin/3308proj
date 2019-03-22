/* eslint-disable no-unused-vars */
import React,{createElement} from 'react';
import ApolloClient, { gql } from "apollo-boost";
import hr_history from './sample_data/ml_output_foo.json';
import {useObservable} from './hooks';

// @client(always: true) ensures that a local resolver is always fired
// uri: "https://dog-graphql-api.glitch.me/graphql",


// typeDefs:gql`
//   extend type Query {
//     hrh: [Hr]!
//   }
//   extend type Query {
//     hrh: [Hr]!
//   }
//   type Hr {
//     id: [Int]!,
//     frequency: [Int]!,
//     start: [Date]!,
//     end: [Date]!,
//   }
// `,
// resolvers: {
//   query:{
//     hr:()=>{
//       return initialState.hr
//     }
//   }
// }
export const client = new ApolloClient({});
client.defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'cache-only',
    errorPolicy: 'all',
  },
  mutate: {
    fetchPolicy: 'cache-only',
    errorPolicy: 'all'
  }
};
client.writeData({data:{ // initial state
  hr:[{
    __typename:'hr',
    id:'0',
    frequency:'5sec',
    start:'2019-03-20T18:53:59-0600',
    end:'2019-03-20T18:57:15-0600',
    beats:hr_history.concat(hr_history).concat(hr_history)
  },
  {
    __typename:'hr',
    id:'1',
    frequency:'5min',
    start:'2019-03-20T18:57:15-0600',
    end:'2019-03-20T18:57:48-0600',
    beats:hr_history
  },]
}});


// options from https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.watchQuery
export const query = (options={})=>{
  const parsed = gql`query {${options.query}}`;
  const obs = client.watchQuery({...options,query:parsed});
  const initial = {data:client.readQuery({query:parsed}),loading:false};
  return function useQuery(p){
    return useObservable(obs,initial);
  }
}

export const mutate = (options={})=>{
  const parsed = gql`query {${options.query}}`;
  const data = client.readQuery({query:parsed});
  const pred = data.hr[1];
  const hist = data.hr[0];
  client.writeQuery({
    query:parsed,
    fetchPolicy:"client-only",
    data:{
      hr:[
        hist,
        {...pred,beats:[...pred.beats,50]},
      ]
    }
  });
}

export const ifLoad = fn=>obj=>obj.loading?fn('loading'):obj;
export const ifErr = fn=>obj=>obj.error?fn(obj.error):obj;
export const ifData = fn=>obj=>obj.data?fn(obj.data):obj;

export const useHeartRateQuery = query({query:`hr {start,end,frequency,beats}`});
