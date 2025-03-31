const VendureClientHandler = require("./client");
const adminCustomersQuery = require("../queries/customers");
const authQuery = require("../queries/auth");
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

async function getCustomerById(workspaceId, customerId) {
  // const customerCacheKey = `workspace:${workspaceId}:customer:${customerId}`;

  try {
    // Try to retrieve customer data from Redis cache
    // const cachedCustomer = await redisService.getCache(customerCacheKey);
    // if (cachedCustomer) {
    //   return cachedCustomer; // Return cached data if available
    // }

    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      adminCustomersQuery.GET_CUSTOMER_BY_ID_QUERY,
      {
        id: customerId,
        orderListOptions: {
          sort: {
            orderPlacedAt: "DESC",
          },
        },
      }
    );

    if (!data.customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    // Standardize the customer data format
    const customer = {
      id: data.customer.id,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      emailAddress: data.customer.emailAddress,
      phoneNumber: data.customer.phoneNumber,
      addresses: data.customer.addresses.map((address) => ({
        id: address.id,
        fullName: address.fullName,
        streetLine1: address.streetLine1,
        city: address.city,
        country: address.country.name,
      })),
      orders: data.customer.orders.items.map((order) => ({
        id: order.id,
        code: order.code,
        total: order.totalWithTax / 100,
        state: order.state,
        orderPlacedAt: order.orderPlacedAt,
      })),
    };

    // Cache the customer data in Redis for 300 seconds
    //await redisService.setCache(customerCacheKey, customer, 300);

    return customer;
  } catch (error) {
    // console.error("Error in getCustomerById:", error);
    throw new Error("Failed to fetch customer details : " + error.message);
  }
}

async function createCustomer(workspaceId, payload) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      authQuery.REGISTER_MUTATION,
      {
        input: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          emailAddress: payload.email,
          phoneNumber: payload.phoneNumber,
        },
        password: payload.password,
      },
      "mutation"
    );

    if (data.createCustomer.errorCode === "EMAIL_ADDRESS_CONFLICT_ERROR") {
      throw new Error("Email address already exists");
    }

    const response = {
      message: "Signup successful",
      data: {
        userId: data.createCustomer.id,
        name:
          data.createCustomer.firstName + " " + data.createCustomer.lastName,
        email: data.createCustomer.emailAddress,
      },
    };

    return response;
  } catch (error) {
    // console.error("Error in getCustomerById:", error);
    throw new Error("Failed to fetch customer details : " + error.message);
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
};
