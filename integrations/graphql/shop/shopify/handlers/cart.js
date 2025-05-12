const ShopifyClientHandler = require("./client");
const shopCartQuery = require("../queries/cart");

async function createCart(workspaceId, customerToken) {
  const data = await ShopifyClientHandler.makeAuthenticatedRequest(
    workspaceId,
    shopCartQuery.CREATE_CART_MUTATION,
    {},
    "mutation"
  );

  return data.cartCreate.cart;
}

async function getActiveCart(workspaceId, customerToken, extraArgs) {
  const data = await ShopifyClientHandler.makeAuthenticatedRequest(
    workspaceId,
    shopCartQuery.GET_CART_BY_ID_QUERY,
    { cartId: extraArgs.cartId }
  );

  const cart = data.cart;

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    total: cart.cost.totalAmount.amount,
    currencyCode: cart.cost.totalAmount.currencyCode,
    lines: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      productVariant: {
        id: node.merchandise.id,
        name: node.merchandise.title,
        price: node.merchandise.price.amount,
        currencyCode: node.merchandise.price.currencyCode,
        imageUrl: node.merchandise.image?.url || null,
        productTitle: node.merchandise.product?.title || null,
      },
    })),
  };
}

async function addItemToCart(
  workspaceId,
  { productVariantId, quantity },
  customerToken,
  extraArgs
) {
  const data = await ShopifyClientHandler.makeAuthenticatedRequest(
    workspaceId,
    shopCartQuery.ADD_ITEM_TO_CART_MUTATION,
    {
      cartId: extraArgs.cartId,
      merchandiseId: productVariantId,
      quantity,
    },
    "mutation"
  );

  return data.cartLinesAdd.cart;
}

async function adjustOrderLine(
  workspaceId,
  { orderLineId, quantity },
  customerToken,
  extraArgs
) {
  const data = await ShopifyClientHandler.makeAuthenticatedRequest(
    workspaceId,
    shopCartQuery.ADJUST_ORDER_LINE_MUTATION,
    {
      cartId: extraArgs.cartId,
      lineUpdates: [
        {
          id: orderLineId,
          quantity,
        },
      ],
    },
    "mutation"
  );

  return data.cartLinesUpdate.cart;
}

async function removeOrderLine(
  workspaceId,
  orderLineId,
  customerToken,
  extraArgs
) {
  const data = await ShopifyClientHandler.makeAuthenticatedRequest(
    workspaceId,
    shopCartQuery.REMOVE_ORDER_LINE_MUTATION,
    {
      cartId: extraArgs.cartId,
      lineIds: [orderLineId],
    },
    "mutation"
  );

  return data.cartLinesRemove.cart;
}

module.exports = {
  createCart,
  getActiveCart,
  addItemToCart,
  adjustOrderLine,
  removeOrderLine,
};
