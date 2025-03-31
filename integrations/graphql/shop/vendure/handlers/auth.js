const shopAuthQuery = require("../queries/auth");
const VendureClientHandler = require("./client");
const { createCustomer } = require("../../../admin/vendure/handlers/customers");
// const redisService = require("../../../../../services/redis");

// Function to fetch and standardize product data with caching for productsList in a separate key with 60-second TTL
async function customerLogin(workspaceId, { email, password }) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopAuthQuery.LOGIN_MUTATION,
      { email, password },
      null,
      "mutation",
      "rest"
    );
    if (data.data.data.login.errorCode === "INVALID_CREDENTIALS_ERROR") {
      throw new Error("Invalid credentials");
    }

    return {
      id: data.data.data.login.id,
      identifier: data.data.data.login.identifier,
      token: data.headers["vendure-auth-token"],
    };
  } catch (error) {
    //console.error("Error in login:", error);
    throw new Error("Failed to login" + error.message);
  }
}

async function customerRegister(workspaceId, payload) {
  try {
    return await createCustomer(workspaceId, payload);
  } catch (error) {
    //console.error("Error in register:", error);
    throw new Error("Failed to register" + error.message);
  }
}

module.exports = {
  customerLogin,
  customerRegister,
};
