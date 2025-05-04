const createApolloClient = require("../../../../../api/apollo/apolloClient");
const requestREST = require("../../../../../api/axios/axiosClient");
const redisService = require("../../../../../services/redis");
const adminAuth = require("../queries/auth");

class VendureClientHandler {
  // Get workspace environment details from Redis

  static async getWorkspaceEnv(workspaceId) {
    const envData = await redisService.getEnv(workspaceId);
    const ALLOWED_COMMERCE_TYPES = ["vendure", "universal commerce"];

    // Ensure necessary fields are available
    if (
      !envData ||
      !envData.commerce ||
      !ALLOWED_COMMERCE_TYPES.includes(envData.commerce.name.toLowerCase()) ||
      !envData.commerce.adUsername ||
      !envData.commerce.adPassword ||
      !envData.commerce.baseUrl
    ) {
      throw new Error(
        `Incomplete or invalid Vendure credentials for workspace ${workspaceId}`
      );
    }

    return envData;
  }

  // Perform login and retrieve token from response headers
  static async login(workspaceId) {
    try {
      const envData = await this.getWorkspaceEnv(workspaceId);

      // Create an Apollo Client without authentication for login
      const url = `${envData.commerce.baseUrl}/admin-api`;
      const data = {
        query: adminAuth.LOGIN_MUTATION,
        variables: {
          username: envData.commerce.adUsername,
          password: envData.commerce.adPassword,
          rememberMe: true,
        },
      };

      // Make the request using the custom `requestREST`
      const response = await requestREST({
        method: "POST",
        url,
        data,
        headers: { "Content-Type": "application/json" },
      });

      const token = response.headers["vendure-auth-token"];

      if (!token) {
        throw new Error("Authentication token not found in headers");
      }

      // Store the token in Redis
      envData.commerce.adAuth = token;
      await redisService.setEnv(workspaceId, envData);

      return token;
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Failed to authenticate with Vendure");
    }
  }

  // Get token from Redis or trigger login if it doesn't exist
  static async getToken(workspaceId) {
    const envData = await this.getWorkspaceEnv(workspaceId);

    // Check if `adAuth` token exists
    if (envData.commerce.adAuth) {
      return envData.commerce.adAuth;
    }

    // Token is missing, perform login to retrieve a new one
    return await this.login(workspaceId);
  }

  // Create and return an authenticated Apollo Client for Vendure
  static async getVendureClient(workspaceId, token = null) {
    const envData = await this.getWorkspaceEnv(workspaceId);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // console.log(token);
    // console.log(headers);

    return createApolloClient(`${envData.commerce.baseUrl}/shop-api`, headers);
  }

  static async getVendureClientRest(workspaceId, payload) {
    const envData = await this.getWorkspaceEnv(workspaceId);
    const response = await requestREST({
      method: "POST",
      url: `${envData.commerce.baseUrl}/shop-api`,
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    // console.log(response.data);
    // console.log(response.headers);
    return {
      data: response.data,
      headers: response.headers,
    };
  }

  // Make an authenticated request with automatic retry on `FORBIDDEN` error
  static async makeAuthenticatedRequest(
    workspaceId,
    queryOrPayload,
    variables = {},
    token = null,
    operation = "query",
    type = "graphql"
  ) {
    let attempt = 0;
    const maxRetries = 1;
    while (attempt < maxRetries) {
      try {
        if (type === "graphql") {
          let client = await this.getVendureClient(workspaceId, token);

          const response =
            operation === "mutation"
              ? await client.mutate({ mutation: queryOrPayload, variables })
              : await client.query({ query: queryOrPayload, variables });

          return response.data;
        } else if (type === "rest") {
          const payloadForRest = {
            query: queryOrPayload,
            variables: variables,
          };
          return await this.getVendureClientRest(workspaceId, payloadForRest);
        }

        throw new Error("Invalid request type. Use 'graphql' or 'rest'.");
      } catch (error) {
        // Check if it's a FORBIDDEN error
        console.error("Request failed:", error.message || error);
        throw error;
      }
    }
  }
}

module.exports = VendureClientHandler;
