const VendureClientHandler = require("./client");
const adminCustomersQuery = require("../queries/customers");
const redisService = require("../../../../../services/redis");

async function getCustomers(workspaceId) {
  const customersCacheKey = `workspace:${workspaceId}:customersList`;

  try {
    // Try to retrieve customers list from Redis cache
    const cachedData = await redisService.getCache(customersCacheKey);
    if (cachedData) {
      return cachedData; // Return cached data if available
    }

    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      adminCustomersQuery.GET_CUSTOMERS_QUERY
    );

    // Standardize the customer data format
    const standardizedCustomers = data.customers.items.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      emailAddress: item.emailAddress,
      phoneNumber: item.phoneNumber,
    }));

    // Cache the standardized customers list in Redis for 60 seconds
    await redisService.setCache(customersCacheKey, standardizedCustomers, 300);

    return standardizedCustomers;
  } catch (error) {
    console.error("Error in getCustomers:", error);
    throw new Error("Failed to fetch customers list");
  }
}

module.exports = {
  getCustomers,
};
