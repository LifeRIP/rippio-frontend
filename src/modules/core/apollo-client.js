import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from '@apollo/client';
import { Observable } from 'rxjs';
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
    on: {
      connected: () => { client.refetchQueries({ include: 'active' }).catch(() => {}); },
    },
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
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getchat_order: {
            merge(existing = [], incoming, { readField }) {
              const messages = new Map();
              for (const message of [...existing, ...incoming]) {
                messages.set(readField('id', message), message);
              }
              return [...messages.values()].sort((a, b) =>
                String(readField('fecha', a)).localeCompare(String(readField('fecha', b))) ||
                Number(readField('id', a)) - Number(readField('id', b))
              );
            },
          },
        },
      },
    },
  }),
  link,
});
