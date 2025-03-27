const gql = require("graphql-tag");

const USER_DETAILS = gql`
{
  activeCustomer{
    id
    firstName
    lastName
    phoneNumber
    emailAddress
    addresses{
      id
      fullName
      company
      streetLine1
      streetLine2
      city
      province
      postalCode
      country{
        name
      }
      phoneNumber
      defaultBillingAddress
      defaultShippingAddress
    }
  }
}
`;

const customerDetails = {
    USER_DETAILS,
};

module.exports = customerDetails;