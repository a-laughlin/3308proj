import React,{createElement} from 'react';
import { ApolloProvider,useMutation as uM,useQuery as uQ} from 'react-apollo-hooks';
import ApolloClient, { gql } from "apollo-boost";


import { ApolloProvider,useMutation as uM,useQuery as uQ} from 'react-apollo-hooks';
import ApolloClient, { gql } from "apollo-boost";


const query = (gqlStr)=>p=>{
  useQuery
  const { data, error, loading } = useQuery(GET_DOGS);
}


export const client = new ApolloClient({
  uri: "https://dog-graphql-api.glitch.me/graphql",
  clientState: {
    typeDefs:`
      type Image { isLiked: Boolean }
      type Mutation { toggleLikedPhoto(id: ID!): Boolean }
      type Query { likedPhotos: [Image] }
    `,
    defaults:{likedPhotos: []},
    resolvers:{
      Image: {
        isLiked: () => false
      },
      Mutation: {
        toggleLikedPhoto: (_, { id }, { cache, getCacheKey }) => {
          const fragmentId = getCacheKey({ id, __typename: "Image" });
          const photo = cache.readFragment({
            id: fragmentId,
            fragment:gql` fragment isLiked on Image { isLiked url } `,
          });

          // first we have to toggle the client-side only field
          cache.writeData({
            id: fragmentId,
            data: { ...photo, isLiked: !photo.isLiked }
          });

          const { likedPhotos } = cache.readQuery({query:gql`{likedPhotos @client {
              url
              id
          }}`});

          // if we're unliking the photo, remove it from the array.
          const data = {
            likedPhotos: photo.isLiked
              ? likedPhotos.filter(photo => photo.id !== id)
              : likedPhotos.concat([ { url: photo.url, id, __typename: "LikedPhoto" }])
          };

          // add the liked photo to an array for easy access
          cache.writeData({ data });
          return data;
        }
      }
    },
  }
});

export const GraphQLProvider =>createElement(ApolloProvider,{client})
