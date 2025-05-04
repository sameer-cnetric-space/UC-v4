const VendureClientHandler = require("./client");
const shopOrdersQuery = require("../queries/orders");
//const redisService = require("../../../../../services/redis");

async function getOrders(workspaceId, customerToken) {
  //const ordersCacheKey = `workspace:${workspaceId}:ordersList`;

  try {
    // Try to retrieve orders list from Redis cache
    // const cachedData = await redisService.getCache(ordersCacheKey);
    // if (cachedData) {
    //   return cachedData; // Return cached data if available
    // }

    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopOrdersQuery.GET_ORDERS_QUERY,
      {
        options: {
          filter: {
            active: {
              eq: false,
            },
          },
          sort: {
            id: "DESC",
          },
        },
      },
      customerToken
    );

    //if()
    // console.log(customerToken);
    // console.log(data);

    if (!data.activeCustomer || !data.activeCustomer?.orders) {
      throw new Error(`Orders not found`);
    }

    // Standardize the orders data format
    const standardizedOrders = data.activeCustomer.orders.items.map((item) => ({
      id: item.id,
      state: item.state,
      orderPlacedAt: item.orderPlacedAt || null,
      totalWithTax: item.totalWithTax / 100,
      currencyCode: item.currencyCode,
      lines: item.lines.map((line) => ({
        id: line.id,
        linePriceWithTax: line.linePriceWithTax / 100,
        quantity: line.quantity,
        productVariant: {
          id: line.productVariant.id,
          name: line.productVariant.name,
          priceWithTax: line.productVariant.priceWithTax / 100,
          featuredAsset: {
            url:
              line.productVariant.featuredAsset?.preview ||
              line.productVariant.product.featuredAsset?.preview ||
              null,
          },
        },
      })),
    }));

    return standardizedOrders;
  } catch (error) {
    //console.error("Error in getOrders:", error);
    throw new Error("Failed to fetch orders list : " + error.message);
  }
}

async function getOrderById(workspaceId, orderId, customerToken) {
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
      shopOrdersQuery.GET_ORDER_BY_ID_QUERY,
      { orderId: orderId },
      customerToken
    );

    if (!data.order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Standardize the order data format
    const standardizedOrder = {
      ...data.order,
      subTotalWithTax: data.order.subTotalWithTax / 100,
      shippingWithTax: data.order.shippingWithTax / 100,
      totalWithTax: data.order.totalWithTax / 100,
      lines: data.order.lines.map((line) => ({
        id: line.id,
        linePriceWithTax: line.linePriceWithTax / 100,
        quantity: line.quantity,
        productVariant: {
          id: line.productVariant.id,
          name: line.productVariant.name,
          priceWithTax: line.productVariant.priceWithTax / 100,
          featuredAsset: {
            url:
              line.productVariant.featuredAsset?.preview ||
              line.productVariant.product.featuredAsset?.preview ||
              null,
          },
        },
      })),
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
