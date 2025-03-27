const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} = require("@apollo/client/core");
const { onError } = require("@apollo/client/link/error");
const fetch = require("cross-fetch");

// Function to create an Apollo Client instance
function createApolloClient(baseURL, headers = {}) {
  // Middleware to dynamically add headers
  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers: existingHeaders }) => ({
      headers: {
        ...existingHeaders,
        ...headers, // Add custom headers
      },
    }));
    return forward(operation);
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    // if (graphQLErrors) {
    //   console.error("GraphQL Errors:", graphQLErrors);
    // }
    if (networkError) {
      console.error("Network Error:", networkError);
    }
  });

  // HTTP link for making network requests
  const httpLink = new HttpLink({
    uri: baseURL, // The GraphQL endpoint
    fetch, // Use `cross-fetch`
  });

  // Combine links
  const link = from([authMiddleware, errorLink, httpLink]);

  // Create Apollo Client instance
  return new ApolloClient({
    link,
    cache: new InMemoryCache(), // Set up in-memory caching
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache", // Adjust as needed for caching behavior
        errorPolicy: "all", // Capture partial results and errors
      },
    },
  });
}

module.exports = createApolloClient;
