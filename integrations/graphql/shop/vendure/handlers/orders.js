const VendureClientHandler = require("./client");
const adminOrdersQuery = require("../queries/orders");
//const redisService = require("../../../../../services/redis");

async function getOrders(workspaceId) {
  const ordersCacheKey = `workspace:${workspaceId}:ordersList`;

  try {
    // Try to retrieve orders list from Redis cache
    // const cachedData = await redisService.getCache(ordersCacheKey);
    // if (cachedData) {
    //   return cachedData; // Return cached data if available
    // }

    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      adminOrdersQuery.GET_ORDERS_QUERY
    );

    // Standardize the orders data format
    const standardizedOrders = data.orders.items.map((item) => ({
      id: item.id,
      status: item.state,
      orderPlacedAt: item.orderPlacedAt || null,
      totalWithTax: item.totalWithTax / 100,
      customer: item.customer
        ? `${item.customer.firstName} ${item.customer.lastName}`
        : null, // Handle null customer
      products: item.lines.map((line) => line.productVariant.name), // Extract product names
    }));

    // Cache the standardized orders list in Redis for 300 seconds (5 minutes)
    //await redisService.setCache(ordersCacheKey, standardizedOrders, 300);

    return standardizedOrders;
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw new Error("Failed to fetch orders list");
  }
}

async function getOrderById(workspaceId, orderId) {
  //const orderCacheKey = `workspace:${workspaceId}:order:${orderId}`;

  try {
    // Try to retrieve order details from Redis cache
    // const cachedData = await redisService.getCache(orderCacheKey);
    // if (cachedData) {
    //   return cachedData; // Return cached data if available
    // }

    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      adminOrdersQuery.GET_ORDER_BY_ID_QUERY,
      { id: orderId }
    );

    if (!data.order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Standardize the order data format
    const standardizedOrder = {
      id: data.order.id,
      status: data.order.state,
      orderPlacedAt: data.order.orderPlacedAt || null,
      totalWithTax: data.order.totalWithTax / 100,
      customer: data.order.customer
        ? {
            id: data.order.customer.id,
            name: `${data.order.customer.firstName} ${data.order.customer.lastName}`,
          }
        : null, // Handle null customer
      products: data.order.lines.map((line) => ({
        name: line.productVariant.name,
        sku: line.productVariant.sku,
        quantity: line.quantity,
        unitPrice: line.unitPriceWithTax / 100,
        imageUrl: line.featuredAsset.preview
          ? line.featuredAsset.preview
          : line.product.featuredAsset.preview, // Extract product images
      })), // Extract detailed product information
      shippingAddress: data.order.shippingAddress || null,
      billingAddress: data.order.billingAddress || null,
    };

    // Cache the standardized order details in Redis for 300 seconds (5 minutes)
    //await redisService.setCache(orderCacheKey, standardizedOrder, 300);

    return standardizedOrder;
  } catch (error) {
    // console.error("Error in getOrderById:", error);
    throw new Error("Failed to fetch order details : " + error.message);
  }
}

module.exports = {
  getOrders,
  getOrderById,
};
