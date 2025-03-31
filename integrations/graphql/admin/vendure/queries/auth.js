const gql = require("graphql-tag");
const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {
    login(username: $username, password: $password, rememberMe: $rememberMe) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on InvalidCredentialsError {
        message
        errorCode
      }
      ... on NativeAuthStrategyError {
        message
        errorCode
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
    createCustomer(input: $input, password: $password) {
      ... on Customer {
        id
        firstName
        lastName
        phoneNumber
        emailAddress
      }
      ... on EmailAddressConflictError {
        errorCode
        message
      }
    }
  }
`;

const adminAuth = {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
};

module.exports = adminAuth;
