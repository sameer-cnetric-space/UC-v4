const createApolloClient = require("../../../../api/apollo/apolloClient");
const redisService = require("../../../../services/redis");
const AuthHandler = require("./handlers/client");

async function getVendureClient(workspaceId) {
  // Retrieve the 'env' data from Redis for the specified workspace
  const envData = await redisService.getEnv(workspaceId);

  if (!envData) {
    throw new Error(
      `Environment variables for workspace ${workspaceId} not found in Redis`
    );
  }

  // Parse the environment data
  const { commerce } = envData;

  // Validate the commerce type and essential fields
  if (!commerce || commerce.name.toLowerCase() !== "vendure") {
    throw new Error(`Workspace ${workspaceId} is not a Vendure workspace`);
  }

  if (!commerce.baseUrl) {
    throw new Error(`Base URL is missing for workspace ${workspaceId}`);
  }

  // Use AuthHandler to handle token retrieval and renewal
  const token = await AuthHandler.getToken(workspaceId);

  // Create and return the Vendure Apollo Client
  return createApolloClient(`${commerce.baseUrl}/admin-api`, {
    Authorization: `Bearer ${token}`,
  });
}

module.exports = getVendureClient;
