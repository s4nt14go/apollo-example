import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  gql,
  ApolloLink,
} from "@apollo/client";
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import config from './config';

const _config = {
    url: config.api.URL,
    region: config.api.REGION,
    auth: {
        type: config.api.AUTH_TYPE,
        apiKey: config.api.API_KEY,
    },
};

export const client = new ApolloClient({
    link: ApolloLink.from([
        createAuthLink(_config),
        createSubscriptionHandshakeLink(_config),
    ]),
    cache: new InMemoryCache(),
});

const ADD_TODO = gql`
  mutation AddTodo($description: String!) {
    addTodo(description: $description) {
      id
      description
    }
  }
`;

// Component for adding a to-do item
function AddTodo() {
  let input;
  const [addTodo] = useMutation(ADD_TODO, {
    update(
      cache,
      {
        data: { addTodo }
      }
    ) {
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  description
                }
              `
            });
            return existingTodos.concat(newTodoRef);
          }
        }
      });
    }
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({
            variables: { description: input.value },

            // Optimistically add the Todo to the locally cached
            // list before the server responds
            optimisticResponse: {
              addTodo: {
                id: 'temp-id',
                __typename: "Todo",
                description: input.value + ' [from optimisticResponse]',
              }
            }
          });
          input.value = "";
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Create item</button>
      </form>
    </div>
  );
}

const GET_TODOS = gql`
  {
    todos {
      id
      description
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $description: String!) {
    updateTodo(id: $id, description: $description) {
      id
      description
    }
  }
`;

// Component for displaying the current to-do list
function Todos() {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [
    updateTodo,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_TODO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const todos = data.todos.map(({ id, description }) => {
    let input;

    return (
      <li key={id}>
        <p>{description}</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            updateTodo({
                variables: { id, description: input.value },
                optimisticResponse: {
                    updateTodo: {
                        id,
                        __typename: "Todo",
                        description: input.value + ' [from optimisticResponse]',
                    }
                }
            });
            input.value = "";
          }}
        >
          <input
            ref={node => {
              input = node;
            }}
          />
          <button type="submit">Update item</button>
        </form>
      </li>
    );
  });

  return (
    <div>
      <ul>{todos}</ul>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error: {mutationError.message}</p>}
    </div>
  );  
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My to-do list</h2>
        <AddTodo />
        <Todos />
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
