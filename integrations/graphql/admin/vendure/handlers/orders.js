const VendureClientHandler = require("./client");
const adminOrdersQuery = require("../queries/orders");
const redisService = require("../../../../../services/redis");

async function getOrders(workspaceId) {
  const ordersCacheKey = `workspace:${workspaceId}:ordersList`;

  try {
    // Try to retrieve orders list from Redis cache
    const cachedData = await redisService.getCache(ordersCacheKey);
    if (cachedData) {
      return cachedData; // Return cached data if available
    }

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
      totalWithTax: item.totalWithTax,
      customer: item.customer
        ? `${item.customer.firstName} ${item.customer.lastName}`
        : null, // Handle null customer
      products: item.lines.map((line) => line.productVariant.name), // Extract product names
    }));

    // Cache the standardized orders list in Redis for 300 seconds (5 minutes)
    await redisService.setCache(ordersCacheKey, standardizedOrders, 300);

    return standardizedOrders;
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw new Error("Failed to fetch orders list");
  }
}

module.exports = {
  getOrders,
};
