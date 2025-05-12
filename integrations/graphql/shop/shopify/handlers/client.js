const createApolloClient = require("../../../../../api/apollo/apolloClient");
const redisService = require("../../../../../services/redis");

class ShopifyClientHandler {
  static async getWorkspaceEnv(workspaceId) {
    const envData = await redisService.getEnv(workspaceId);
    const ALLOWED_COMMERCE_TYPES = ["shopify"];

    if (
      !envData ||
      !envData.commerce ||
      !ALLOWED_COMMERCE_TYPES.includes(envData.commerce.name.toLowerCase()) ||
      !envData.commerce.shopName ||
      !envData.commerce.storefrontToken ||
      !envData.commerce.apiVersion
    ) {
      throw new Error(
        `Incomplete or invalid Shopify credentials for workspace ${workspaceId}`
      );
    }

    return envData;
  }

  static async getShopifyClient(workspaceId) {
    const envData = await this.getWorkspaceEnv(workspaceId);

    const uri = `https://${envData.commerce.shopName}.myshopify.com/api/${envData.commerce.apiVersion}/graphql.json`;
    const headers = {
      "X-Shopify-Storefront-Access-Token": envData.commerce.storefrontToken,
      "Content-Type": "application/json",
    };

    return createApolloClient(uri, headers);
  }

  static async makeAuthenticatedRequest(
    workspaceId,
    queryOrPayload,
    variables = {},
    operation = "query"
  ) {
    try {
      const client = await this.getShopifyClient(workspaceId);

      const response =
        operation === "mutation"
          ? await client.mutate({ mutation: queryOrPayload, variables })
          : await client.query({ query: queryOrPayload, variables });

      return response.data;
    } catch (error) {
      console.error("Shopify Request Error:", error.message || error);
      throw error;
    }
  }
}

module.exports = ShopifyClientHandler;
