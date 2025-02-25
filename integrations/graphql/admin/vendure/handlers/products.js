const adminProductsQuery = require("../queries/products");
const VendureClientHandler = require("./client");
const redisService = require("../../../../../services/redis");

// Function to fetch and standardize product data with caching for productsList in a separate key with 60-second TTL
async function getProducts(workspaceId) {
  const productsCacheKey = `workspace:${workspaceId}:productsList`; // Separate key for productsList with TTL

  try {
    // Try to retrieve products list from Redis cache
    const cachedData = await redisService.getCache(productsCacheKey);
    if (cachedData) {
      return cachedData; // Return cached data if available
    }

    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      adminProductsQuery.GET_PRODUCTS_QUERY
    );

    // Standardize the product data format based on the updated query structure
    const standardizedProducts = data.products.items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      enabled: item.enabled,
      imageUrl: item.featuredAsset ? item.featuredAsset.preview : null,
      variantCount: item.variantList ? item.variantList.totalItems : 0,
    }));

    // Cache the standardized products list in Redis for 5 minutes
    await redisService.setCache(productsCacheKey, standardizedProducts, 300);

    return standardizedProducts;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw new Error("Failed to fetch products");
  }
}

// Function to fetch and standardize data for a specific product by ID without caching
async function getProductById(workspaceId, productId) {
  try {
    // Make an authenticated request for a specific product by ID
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      adminProductsQuery.GET_PRODUCT_BY_ID_QUERY,
      {
        productId,
      }
    );

    if (!data.product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Standardize the product data format
    const product = data.product;
    const standardizedProduct = {
      id: product.id,
      name: product.name,
      updatedAt: product.updatedAt,
      slug: product.slug,
      description: product.description,
      collections: product.collections.map((collection) => collection.name),
      featuredImageUrl: product.featuredAsset
        ? product.featuredAsset.preview
        : null,
      variantCount: product.variantList ? product.variantList.totalItems : 0,
      variants: product.variantList.items.map((variant) => ({
        sku: variant.sku,
        stockLevel: variant.stockLevel,
        price: variant.prices.length > 0 ? variant.prices[0].price / 100 : null,
        currencyCode:
          variant.prices.length > 0 ? variant.prices[0].currencyCode : null,
        previewImage: variant.featuredAsset
          ? variant.featuredAsset.preview
          : null,
      })),
      options: product.variants.map((variant) => ({
        optionId: variant.options[0].id,
        optionName: variant.options[0].name,
      })),
    };

    return standardizedProduct;
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw new Error("Failed to fetch product by ID : " + error.message);
  }
}

module.exports = {
  getProducts,
  getProductById,
};
