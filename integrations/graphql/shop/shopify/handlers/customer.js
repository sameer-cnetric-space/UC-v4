const ShopifyClientHandler = require("./client");
const shopOrdersQuery = require("../queries/customer");

async function getUserDetails(workspaceId, customerToken) {
  try {
    const data = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopOrdersQuery.USER_DETAILS,
      { customerAccessToken: customerToken }
    );

    const userDetails = data.customer;

    if (!userDetails) {
      throw new Error("Customer not found or token invalid.");
    }

    const standardizedUserDetails = {
      id: userDetails.id,
      emailAddress: userDetails.email,
      name: `${userDetails.firstName || ""} ${
        userDetails.lastName || ""
      }`.trim(),
      phoneNumber: userDetails.phone || null,
    };

    return {
      customer: standardizedUserDetails,
    };
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw new Error("Failed to fetch user details");
  }
}

module.exports = {
  getUserDetails,
};
