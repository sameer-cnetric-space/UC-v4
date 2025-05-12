const gql = require("graphql-tag");

const LOGIN_MUTATION = gql`
  mutation LoginCustomer($email: String!, $password: String!) {
    customerAccessTokenCreate(input: { email: $email, password: $password }) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const customerAuth = {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
};

module.exports = customerAuth;
