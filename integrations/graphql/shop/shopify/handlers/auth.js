const shopAuthQuery = require("../queries/auth");
const ShopifyClientHandler = require("./client");

async function customerLogin(workspaceId, { email, password }) {
  try {
    const response = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopAuthQuery.LOGIN_MUTATION,
      { email, password },
      "mutation"
    );
    if (
      response.customerAccessTokenCreate?.customerUserErrors[0]?.code ===
      "UNIDENTIFIED_CUSTOMER"
    ) {
      throw new Error("Invalid credentials");
    }

    return {
      token: response.customerAccessTokenCreate.customerAccessToken.accessToken,
      expiresAt:
        response.customerAccessTokenCreate.customerAccessToken.expiresAt,
    };
  } catch (error) {
    throw new Error("Failed to login: " + error.message);
  }
}

async function customerRegister(workspaceId, payload) {
  try {
    const response = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopAuthQuery.REGISTER_MUTATION,
      {
        input: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: "+91" + payload.phoneNumber,
          password: payload.password,
          acceptsMarketing: true,
        },
      },
      "mutation"
    );

    if (response.customerCreate.customerUserErrors.length > 0) {
      const errorMessages = result.userErrors
        .map((err) => err.message)
        .join(", ");
      throw new Error("Shopify registration failed: " + errorMessages);
    }

    // if (result.userErrors?.length > 0) {
    //   throw new Error(JSON.stringify(result));
    // }
    // console.log(JSON.stringify(result));
    return {
      message: "Signup successful",
      data: {
        userId: response.customerCreate.customer.id,
        name:
          response.customerCreate.customer.firstName +
          " " +
          response.customerCreate.customer.lastName,
        email: response.customerCreate.customer.email,
      },
    };
  } catch (error) {
    throw new Error("Failed to register: " + error.message);
  }
}

module.exports = {
  customerLogin,
  customerRegister,
};
