const gql = require("graphql-tag");

// Get customer orders using access token
const GET_ORDERS_QUERY = gql`
  query GetCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 50) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            fulfillmentStatus
            financialStatus
            lineItems(first: 100) {
              edges {
                node {
                  id
                  quantity
                  title
                  originalTotalPrice {
                    amount
                  }
                  variant {
                    id
                    title
                    price {
                      amount
                    }
                    image {
                      url
                    }
                    product {
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Get a single order by ID (Note: Shopify Storefront API does NOT support fetching individual orders by ID via Storefront API)
// You generally need to use Admin API for that. Below is a placeholder if you're using Storefront API and storing order IDs separately.
const GET_ORDER_BY_ID_QUERY = gql`
  query GetOrderById($orderId: ID!) {
    node(id: $orderId) {
      ... on Order {
        id
        orderNumber
        processedAt
        totalPrice {
          amount
          currencyCode
        }
        fulfillmentStatus
        financialStatus
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              originalTotalPrice {
                amount
              }
              variant {
                id
                title
                price {
                  amount
                }
                image {
                  url
                }
                product {
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
        shippingAddress {
          name
          address1
          address2
          city
          province
          zip
          country
          phone
        }
      }
    }
  }
`;

const shopOrdersQuery = {
  GET_ORDERS_QUERY,
  GET_ORDER_BY_ID_QUERY,
};

module.exports = shopOrdersQuery;
