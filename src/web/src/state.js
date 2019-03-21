/* eslint-disable no-unused-vars */
import React,{createElement} from 'react';
import { ApolloProvider,useMutation,useQuery} from 'react-apollo-hooks';

import ApolloClient, { gql,InMemoryCache } from "apollo-boost";
import hr_history from './sample_data/ml_output_foo.json';
/* eslint-enable no-unused-vars */


// const cache = new InMemoryCache();
// cache.writeData({data:{
//   hrh:{
//     __typename:'hr_hists',
//     '0':{id:0,__typename:'hr_hist',beats:hr_history.concat(hr_history).concat(hr_history)}
//   },
//   hrp:{
//     __typename:'hr_preds',
//     '0':{id:0,__typename:'hr_pred',beats:hr_history}
//   }
// }});
// console.log(`cache`, cache);
const client = new ApolloClient({
  // uri: "https://dog-graphql-api.glitch.me/graphql",
  // typeDefs:gql`
  //   extend type Query {
  //     hrh: [Hr]!
  //   }
  //   extend type Query {
  //     hrh: [Hr]!
  //   }
  //   type Hr {
  //     hrh: [Int]!
  //   }
  // `,
  // resolvers: {
  //   hr:
  // }
});

client.writeData({data:{
  hr:[
    {
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
    },
  ]
}})

export const GraphQLProvider = p=> createElement(ApolloProvider,{...p,client});
