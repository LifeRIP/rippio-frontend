import { ApolloClient, ApolloLink, Observable, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

export const isChatConfigured = Boolean(
  import.meta.env.VITE_API_URL_GRAPHQL && import.meta.env.VITE_API_URL_GRAPHQL_WS
);

let link = new ApolloLink(() => new Observable((observer) => {
  observer.error(new Error('El chat no está disponible: falta configurar el servicio de mensajes.'));
}));

if (isChatConfigured) {
  const wsLink = new GraphQLWsLink(createClient({
    url: import.meta.env.VITE_API_URL_GRAPHQL_WS,
    retryAttempts: Infinity,
  }));
  const httpLink = new HttpLink({ uri: import.meta.env.VITE_API_URL_GRAPHQL });
  link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );
}

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
