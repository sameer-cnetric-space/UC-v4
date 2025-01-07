const gql = require("graphql-tag");

const GET_CUSTOMERS_QUERY = gql`
  query Query {
    customers {
      totalItems
      items {
        id
        firstName
        lastName
        emailAddress
        phoneNumber
      }
    }
  }
`;

const GET_CUSTOMER_BY_ID_QUERY = gql`
  query CustomerDetailQuery($id: ID!, $orderListOptions: OrderListOptions) {
    customer(id: $id) {
      id
      createdAt
      updatedAt
      title
      firstName
      lastName
      phoneNumber
      emailAddress
      user {
        id
        identifier
        verified
        lastLogin
      }
      addresses {
        id
        createdAt
        updatedAt
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          id
          code
          name
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
      groups {
        id
        name
      }
      orders(options: $orderListOptions) {
        items {
          id
          code
          type
          state
          totalWithTax
          currencyCode
          createdAt
          updatedAt
          orderPlacedAt
        }
        totalItems
      }
    }
  }
`;

const adminCustomersQuery = {
  GET_CUSTOMERS_QUERY,
  GET_CUSTOMER_BY_ID_QUERY,
};

module.exports = adminCustomersQuery;
