const { GET_CHECKOUT_URL_QUERY } = require("../queries/cart");
const ShopifyClientHandler = require("./client");

async function getCheckoutUrl(workspaceId, cartId) {
  try {
    const response = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      GET_CHECKOUT_URL_QUERY,
      { cartId }
    );

    const cart = response.data?.data?.cart;

    if (!cart || !cart.checkoutUrl) {
      throw new Error("Checkout URL not available for this cart.");
    }

    return {
      checkoutUrl: cart.checkoutUrl,
    };
  } catch (error) {
    throw new Error("Failed to get checkout URL: " + error.message);
  }
}

module.exports = {
  getCheckoutUrl,
};
