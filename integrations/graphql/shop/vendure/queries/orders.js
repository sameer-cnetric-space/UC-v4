const gql = require("graphql-tag");

const GET_ORDERS_QUERY = gql`
  query ActiveCustomer($options: OrderListOptions) {
    activeCustomer {
      orders(options: $options) {
        items {
          id
          orderPlacedAt
          totalWithTax
          currencyCode
          state
          lines {
            id
            linePriceWithTax
            quantity
            productVariant {
              id
              name
              priceWithTax
              featuredAsset {
                preview
              }
            }
          }
        }
      }
    }
  }
`;

const GET_ORDER_BY_ID_QUERY = gql`
  query GetOrder($orderId: ID!) {
    order(id: $orderId) {
      id
      orderPlacedAt
      subTotalWithTax
      shippingWithTax
      totalWithTax
      currencyCode
      state
      payments {
        metadata
      }
      lines {
        id
        linePriceWithTax
        quantity
        productVariant {
          id
          name
          priceWithTax
          featuredAsset {
            preview
          }
          currencyCode
        }
      }
      shippingAddress {
        fullName
        phoneNumber
        streetLine1
        streetLine2
        city
        province
        postalCode
        countryCode
        country
      }
      billingAddress {
        fullName
        phoneNumber
        streetLine1
        streetLine2
        city
        province
        postalCode
        countryCode
        country
      }
    }
  }
`;

const shopOrdersQuery = {
  GET_ORDERS_QUERY,
  GET_ORDER_BY_ID_QUERY,
};

module.exports = shopOrdersQuery;
