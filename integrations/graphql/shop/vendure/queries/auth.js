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

const customerAuth = {
  LOGIN_MUTATION,
};

module.exports = customerAuth;
