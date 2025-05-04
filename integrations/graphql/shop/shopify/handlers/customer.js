const VendureClientHandler = require("./client");
const shopOrdersQuery = require("../queries/customer");

async function getUserDetails(workspaceId, customerToken) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopOrdersQuery.USER_DETAILS,
      {},
      customerToken
    );

    // Modify and standardize the products in the response
    const userDetails = data.activeCustomer;
    const standardizedUserDetails = {
      id: userDetails.id,
      emailAddress: userDetails.emailAddress,
      name: userDetails.firstName + " " + userDetails.lastName,
      phoneNumber: userDetails.phoneNumber,
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
