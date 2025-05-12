const gql = require("graphql-tag");

const GET_CART_BY_ID_QUERY = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      createdAt
      updatedAt
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                }
                product {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = gql`
  mutation CreateCart {
    cartCreate(input: {}) {
      cart {
        id
        createdAt
        updatedAt
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_ITEM_TO_CART_MUTATION = gql`
  mutation CartLinesAdd($cartId: ID!, $merchandiseId: ID!, $quantity: Int!) {
    cartLinesAdd(
      cartId: $cartId
      lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }]
    ) {
      cart {
        id
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
              quantity
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

const REMOVE_ORDER_LINE_MUTATION = gql`
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      userErrors {
        code
        field
        message
      }
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

const ADJUST_ORDER_LINE_MUTATION = gql`
  mutation CartLinesUpdate(
    $cartId: ID!
    $lineUpdates: [CartLineUpdateInput!]!
  ) {
    cartLinesUpdate(cartId: $cartId, lines: $lineUpdates) {
      cart {
        id
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
              quantity
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

const shopCart = {
  CREATE_CART_MUTATION,
  GET_CART_BY_ID_QUERY,
  ADD_ITEM_TO_CART_MUTATION,
  REMOVE_ORDER_LINE_MUTATION,
  ADJUST_ORDER_LINE_MUTATION,
};

module.exports = shopCart;
