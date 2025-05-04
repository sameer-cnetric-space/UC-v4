// const gql = require("graphql-tag");

// const GET_ACTIVE_CART_QUERY = gql`
//   query ActiveOrder {
//     activeOrder {
//       id
//       lines {
//         id
//         linePriceWithTax
//         quantity
//         productVariant {
//           id
//           name
//           priceWithTax
//           featuredAsset {
//             preview
//           }
//           product {
//             featuredAsset {
//               preview
//             }
//           }
//           currencyCode
//         }
//       }
//       subTotalWithTax
//       shippingWithTax
//       totalWithTax
//       totalQuantity
//       currencyCode
//     }
//   }
// `;

// const ADD_ITEM_TO_CART_MUTATION = gql`
//   mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
//     addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
//       ... on Order {
//         id
//         lines {
//           id
//           linePriceWithTax
//           quantity
//           productVariant {
//             id
//             name
//             priceWithTax
//             assets {
//               preview
//             }
//             product {
//               assets {
//                 preview
//               }
//             }
//             currencyCode
//           }
//         }
//         totalWithTax
//         totalQuantity
//         currencyCode
//       }
//     }
//   }
// `;

// const REMOVE_ORDER_LINE_MUTATION = gql`
//   mutation Mutation($orderLineId: ID!) {
//     removeOrderLine(orderLineId: $orderLineId) {
//       ... on Order {
//         id
//         lines {
//           id
//           linePriceWithTax
//           quantity
//           productVariant {
//             id
//             name
//             priceWithTax
//             assets {
//               preview
//             }
//             product {
//               assets {
//                 preview
//               }
//             }
//             currencyCode
//           }
//         }
//         totalWithTax
//         totalQuantity
//         currencyCode
//       }
//       ... on OrderModificationError {
//         errorCode
//         message
//       }
//     }
//   }
// `;

// const ADJUST_ORDER_LINE_MUTATION = gql`
//   mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
//     adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
//       ... on Order {
//         id
//         lines {
//           id
//           linePriceWithTax
//           quantity
//           productVariant {
//             id
//             name
//             priceWithTax
//             assets {
//               preview
//             }
//             product {
//               assets {
//                 preview
//               }
//             }
//             currencyCode
//           }
//         }
//         totalWithTax
//         totalQuantity
//         currencyCode
//       }
//       ... on OrderModificationError {
//         errorCode
//         message
//       }
//       ... on OrderLimitError {
//         errorCode
//         message
//         maxItems
//       }
//       ... on NegativeQuantityError {
//         errorCode
//         message
//       }
//       ... on InsufficientStockError {
//         errorCode
//         message
//         quantityAvailable
//       }
//     }
//   }
// `;

// const shopCart = {
//   GET_ACTIVE_CART_QUERY,
//   ADD_ITEM_TO_CART_MUTATION,
//   REMOVE_ORDER_LINE_MUTATION,
//   ADJUST_ORDER_LINE_MUTATION,
// };

// module.exports = shopCart;

// const gql = require("graphql-tag");

// const GET_ACTIVE_CART_QUERY = gql`
//   query ActiveOrder {
//     activeOrder {
//       id
//       lines {
//         id
//         linePriceWithTax
//         quantity
//         productVariant {
//           id
//           name
//           priceWithTax
//           featuredAsset {
//             preview
//           }
//           product {
//             featuredAsset {
//               preview
//             }
//           }
//           currencyCode
//         }
//       }
//       subTotalWithTax
//       shippingWithTax
//       totalWithTax
//       totalQuantity
//       currencyCode
//     }
//   }
// `;

// const ADD_ITEM_TO_CART_MUTATION = gql`
//   mutation CartLinesAdd($cartId: ID!, $merchandiseId: ID!, $quantity: Int!) {
//     cartLinesAdd(
//       cartId: $cartId
//       lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }]
//     ) {
//       cart {
//         id
//         cost {
//           totalAmount {
//             amount
//             currencyCode
//           }
//         }
//         lines(first: 100) {
//           edges {
//             node {
//               id
//               merchandise {
//                 ... on ProductVariant {
//                   id
//                   title
//                 }
//               }
//               quantity
//             }
//           }
//         }
//       }
//       userErrors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;

// const REMOVE_ORDER_LINE_MUTATION = gql`
//   mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
//     cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
//       userErrors {
//         code
//         field
//         message
//       }
//       cart {
//         id
//         lines(first: 100) {
//           edges {
//             node {
//               id
//               merchandise {
//                 ... on ProductVariant {
//                   id
//                   title
//                 }
//               }
//               quantity
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// const ADJUST_ORDER_LINE_MUTATION = gql`
//   mutation CartLinesUpdate(
//     $cartId: ID!
//     $lineUpdates: [CartLineUpdateInput!]!
//   ) {
//     cartLinesUpdate(cartId: $cartId, lines: $lineUpdates) {
//       cart {
//         id
//         totalQuantity
//         cost {
//           totalAmount {
//             amount
//             currencyCode
//           }
//         }
//         lines(first: 100) {
//           edges {
//             node {
//               merchandise {
//                 ... on ProductVariant {
//                   id
//                   title
//                 }
//               }
//               quantity
//             }
//           }
//         }
//       }
//       userErrors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;

// const shopCart = {
//   GET_ACTIVE_CART_QUERY,
//   ADD_ITEM_TO_CART_MUTATION,
//   REMOVE_ORDER_LINE_MUTATION,
//   ADJUST_ORDER_LINE_MUTATION,
// };

// module.exports = shopCart;
