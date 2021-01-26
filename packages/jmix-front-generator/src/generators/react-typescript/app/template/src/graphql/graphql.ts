import {ApolloClient, InMemoryCache} from '@apollo/client';
import { GRAPHQL_URI } from '../config';

export const createApolloClient = () => {
  return new ApolloClient({
    uri: GRAPHQL_URI,
    cache: new InMemoryCache({
      // For String ID entities add the type policies
      // (`StringIdEntity` is the name of the entity and `identifier` is the name of the id field):
      //
      // typePolicies: {
      //   StringIdEntity: {
      //     keyFields: ['identifier']
      //   }
      // }
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      }
    }
  })
}
