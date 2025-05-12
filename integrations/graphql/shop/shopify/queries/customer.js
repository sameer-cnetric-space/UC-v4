const gql = require("graphql-tag");

const USER_DETAILS = gql`
  query CustomerQuery($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

const customerDetails = {
  USER_DETAILS,
};

module.exports = customerDetails;
