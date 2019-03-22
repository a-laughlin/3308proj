/* eslint-disable no-unused-vars */
import React,{createElement} from 'react';
import { ApolloProvider} from 'react-apollo-hooks';
// import { ApolloProvider} from 'react-apollo';

import ApolloClient, { gql,InMemoryCache } from "apollo-boost";
import hr_history from './sample_data/ml_output_foo.json';

const initialState = {
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
}
// @client(always: true) ensures that a local resolver is always fired
export const client = new ApolloClient({
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
});
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
client.writeData({data:initialState});

// export const GraphQLProvider = p=> createElement(ApolloProvider,{...p,client});
// export const GraphQLProvider = p=> createElement(ApolloProvider,{...p,client});
export const GraphQLProvider = p=> createElement('div',{...p,client});
