const gql = require("graphql-tag");

const GET_CHECKOUT_URL_QUERY = gql`
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
    }
  }
`;

module.exports = {
  GET_CHECKOUT_URL_QUERY,
};
