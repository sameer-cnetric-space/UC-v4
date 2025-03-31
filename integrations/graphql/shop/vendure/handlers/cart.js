const VendureClientHandler = require("./client");
const shopCartQuery = require("../queries/cart");

async function getActiveCart(workspaceId, customerToken) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCartQuery.GET_ACTIVE_CART_QUERY,
      {},
      customerToken
    );

    if (!data.activeOrder) {
      throw new Error("Cart not found");
    }
    // Standardize the cart data format
    const standardizedCart = {
      id: data.activeOrder.id,
      lines: data.activeOrder.lines.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        linePrice: line.linePriceWithTax / 100,
        productVariant: {
          id: line.productVariant.id,
          name: line.productVariant.name,
          price: line.productVariant.priceWithTax / 100,
          currencyCode: line.productVariant.currencyCode,
          featuredAsset: {
            url: line.productVariant.featuredAsset.preview,
          },
        },
      })),
      total: data.activeOrder.totalWithTax / 100,
      currencyCode: data.activeOrder.currencyCode,
      totalQuantity: data.activeOrder.totalQuantity,
    };

    return standardizedCart;
  } catch (error) {
    //console.error("Error in getActiveCart:", error);
    throw new Error("Failed to fetch the cart" + error.message);
  }
}

async function addItemToCart(
  workspaceId,
  { productVariantId, quantity },
  customerToken
) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCartQuery.ADD_ITEM_TO_CART_MUTATION,
      {
        productVariantId: productVariantId,
        quantity: quantity,
      },
      customerToken,
      "mutation"
    );

    // Standardize the cart data format
    const standardizedCart = {
      id: data.addItemToOrder.id,
      lines: data.addItemToOrder.lines.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        linePrice: line.linePriceWithTax / 100,
        productVariant: {
          id: line.productVariant.id,
          name: line.productVariant.name,
          price: line.productVariant.priceWithTax / 100,
          currencyCode: line.productVariant.currencyCode,
          images: [
            ...line.productVariant.product.assets.map((asset) => ({
              url: asset.preview,
            })),
            ...line.productVariant.assets.map((asset) => ({
              url: asset.preview,
            })),
          ],
        },
      })),
      total: data.addItemToOrder.totalWithTax / 100,
      currencyCode: data.addItemToOrder.currencyCode,
      totalQuantity: data.addItemToOrder.totalQuantity,
    };

    return standardizedCart;
  } catch (error) {
    console.error("Error in addItemToCart:", error);
    throw new Error("Failed to add to cart");
  }
}

async function removeOrderLine(workspaceId, orderLineId, customerToken) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCartQuery.REMOVE_ORDER_LINE_MUTATION,
      {
        orderLineId: orderLineId,
      },
      customerToken,
      "mutation"
    );

    if (!data.removeOrderLine) {
      throw new Error("Cart not found");
    }

    // Standardize the cart data format
    const standardizedCart = {
      id: data.removeOrderLine.id,
      lines: data.removeOrderLine.lines.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        linePrice: line.linePriceWithTax / 100,
        productVariant: {
          id: line.productVariant.id,
          name: line.productVariant.name,
          price: line.productVariant.priceWithTax / 100,
          currencyCode: line.productVariant.currencyCode,
          images: [
            ...line.productVariant.product.assets.map((asset) => ({
              url: asset.preview,
            })),
            ...line.productVariant.assets.map((asset) => ({
              url: asset.preview,
            })),
          ],
        },
      })),
      total: data.removeOrderLine.totalWithTax / 100,
      currencyCode: data.removeOrderLine.currencyCode,
      totalQuantity: data.removeOrderLine.totalQuantity,
    };

    return standardizedCart;
  } catch (error) {
    console.error("Error in removeOrderLine:", error);
    throw new Error("Failed to remove from cart");
  }
}

async function adjustOrderLine(
  workspaceId,
  { orderLineId, quantity },
  customerToken
) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCartQuery.ADJUST_ORDER_LINE_MUTATION,
      {
        orderLineId: orderLineId,
        quantity: quantity,
      },
      customerToken,
      "mutation"
    );

    if (!data.adjustOrderLine) {
      throw new Error("Cart not found");
    }

    // Standardize the cart data format
    const standardizedCart = {
      id: data.adjustOrderLine.id,
      lines: data.adjustOrderLine.lines.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        linePrice: line.linePriceWithTax / 100,
        productVariant: {
          id: line.productVariant.id,
          name: line.productVariant.name,
          price: line.productVariant.priceWithTax / 100,
          currencyCode: line.productVariant.currencyCode,
          images: [
            ...line.productVariant.product.assets.map((asset) => ({
              url: asset.preview,
            })),
            ...line.productVariant.assets.map((asset) => ({
              url: asset.preview,
            })),
          ],
        },
      })),
      total: data.adjustOrderLine.totalWithTax / 100,
      currencyCode: data.adjustOrderLine.currencyCode,
      totalQuantity: data.adjustOrderLine.totalQuantity,
    };

    return standardizedCart;
  } catch (error) {
    //console.error("Error in adjustorderLine:", error);
    throw new Error("Failed to adjust cart" + error.message);
  }
}

module.exports = {
  getActiveCart,
  addItemToCart,
  removeOrderLine,
  adjustOrderLine,
};
