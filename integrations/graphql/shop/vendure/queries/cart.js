const gql = require("graphql-tag");

const GET_ACTIVE_CART_QUERY = gql`
  query ActiveOrder {
    activeOrder {
      id
      lines {
        id
        linePriceWithTax
        quantity
        productVariant {
          id
          name
          priceWithTax
          featuredAsset{
            preview
          }
          currencyCode
        }
      }
      subTotalWithTax
      shippingWithTax
      totalWithTax
      totalQuantity
      currencyCode
    }
  }
`;

const ADD_ITEM_TO_CART_MUTATION = gql`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
        lines {
          id
          linePriceWithTax
          quantity
          productVariant {
            id
            name
            priceWithTax
            assets {
              preview
            }
            product {
              assets {
                preview
              }
            }
            currencyCode
          }
        }
        totalWithTax
        totalQuantity
        currencyCode
      }
    }
  }
`;

const REMOVE_ORDER_LINE_MUTATION = gql`
  mutation Mutation($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order {
        id
        lines {
          id
          linePriceWithTax
          quantity
          productVariant {
            id
            name
            priceWithTax
            assets {
              preview
            }
            product {
              assets {
              preview
              }
            }
            currencyCode
          }
        }
        totalWithTax
        totalQuantity
        currencyCode
      }
      ... on OrderModificationError {
        errorCode
        message
      }
    }
  }
`

const ADJUST_ORDER_LINE_MUTATION = gql`
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ... on Order {
        id
        lines {
          id
          linePriceWithTax
          quantity
          productVariant {
            id
            name
            priceWithTax
            assets {
              preview
            }
            product {
              assets {
                preview
              }
            }
            currencyCode
          }
        }
        totalWithTax
        totalQuantity
        currencyCode
      }
      ... on OrderModificationError {
        errorCode
        message
      }
      ... on OrderLimitError {
        errorCode
        message
        maxItems
      }
      ... on NegativeQuantityError {
        errorCode
        message
      }
      ... on InsufficientStockError {
        errorCode
        message
        quantityAvailable
      }
    }
  }
`;

const shopCart = {
    GET_ACTIVE_CART_QUERY,
    ADD_ITEM_TO_CART_MUTATION,
    REMOVE_ORDER_LINE_MUTATION,
    ADJUST_ORDER_LINE_MUTATION,
};
  
module.exports = shopCart;