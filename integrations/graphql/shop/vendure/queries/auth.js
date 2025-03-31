const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
  login(username: $email, password: $password) {
    ... on CurrentUser {
      id
      identifier
      channels {
        id
        token
      }
    }
    ... on InvalidCredentialsError {
      errorCode
      message
      authenticationError
    }
    ... on NotVerifiedError {
      errorCode
      message
    }
  }
}
 `;

const REGISTER_MUTATION = `
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
`

const customerAuth = {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
};

module.exports = customerAuth;
