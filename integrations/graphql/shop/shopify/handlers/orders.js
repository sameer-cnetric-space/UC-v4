const ShopifyClientHandler = require("./client");
const shopOrdersQuery = require("../queries/orders");

async function getOrders(workspaceId, customerToken) {
  try {
    console.log(customerToken);
    const data = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopOrdersQuery.GET_ORDERS_QUERY,
      {
        customerAccessToken: customerToken,
      }
    );
    console.log(JSON.stringify(data));

    const orders = data?.customer?.orders?.edges || [];

    const standardizedOrders = orders.map(({ node }) => ({
      id: node.id,
      orderNumber: node.orderNumber,
      orderPlacedAt: node.processedAt,
      totalWithTax: parseFloat(node.totalPrice.amount),
      currencyCode: node.totalPrice.currencyCode,
      state: `${node.financialStatus}-${node.fulfillmentStatus}`,
      lines: node.lineItems.edges.map(({ node: line }) => ({
        id: line.id,
        quantity: line.quantity,
        linePriceWithTax: parseFloat(line.originalTotalPrice.amount),
        productVariant: {
          id: line.variant?.id,
          name: line.variant?.title,
          priceWithTax: parseFloat(line.variant?.price.amount),
          featuredAsset: {
            url:
              line.variant?.image?.url ||
              line.variant?.product?.images?.edges?.[0]?.node?.url ||
              null,
          },
        },
      })),
    }));

    return standardizedOrders;
  } catch (error) {
    throw new Error("Failed to fetch orders list: " + error.message);
  }
}

async function getOrderById(workspaceId, orderId, customerToken) {
  try {
    const data = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopOrdersQuery.GET_ORDER_BY_ID_QUERY,
      {
        orderId: orderId,
      }
    );

    const order = data?.node;

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const standardizedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      orderPlacedAt: order.processedAt,
      totalWithTax: parseFloat(order.totalPrice.amount),
      currencyCode: order.totalPrice.currencyCode,
      state: `${order.financialStatus}-${order.fulfillmentStatus}`,
      lines: order.lineItems.edges.map(({ node: line }) => ({
        id: line.id,
        quantity: line.quantity,
        linePriceWithTax: parseFloat(line.originalTotalPrice.amount),
        productVariant: {
          id: line.variant?.id,
          name: line.variant?.title,
          priceWithTax: parseFloat(line.variant?.price.amount),
          featuredAsset: {
            url:
              line.variant?.image?.url ||
              line.variant?.product?.images?.edges?.[0]?.node?.url ||
              null,
          },
        },
      })),
      shippingAddress: order.shippingAddress || null,
    };

    return standardizedOrder;
  } catch (error) {
    throw new Error("Failed to fetch order details: " + error.message);
  }
}

module.exports = {
  getOrders,
  getOrderById,
};
