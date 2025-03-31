const shopProductsQuery = require("../queries/products");
const VendureClientHandler = require("./client");
// const redisService = require("../../../../../services/redis");

// Function to fetch and standardize product data with caching for productsList in a separate key with 60-second TTL
async function getProducts(workspaceId) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopProductsQuery.GET_PRODUCTS_QUERY
    );

    // Modify and standardize the products in the response
    const standardizedProducts = data.products.items.map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.featuredAsset ? item.featuredAsset.preview : null,
      facetValues: item.facetValues.map((facet) => facet.name),
      collections: item.collections.map((collection) => ({
        id: collection.id,
        name: collection.name,
      })),
      optionGroups: item.optionGroups.map((group) => ({
        name: group.name,
        options: group.options.map((option) => option.name),
      })),
      variants: item.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        currencyCode: variant.currencyCode,
        priceWithTax: variant.priceWithTax / 100,
        imageUrl: variant.featuredAsset ? variant.featuredAsset.preview : [],
      })),
    }));

    return {
      totalItems: data.products.totalItems,
      items: standardizedProducts,
    };
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
      shopProductsQuery.GET_PRODUCT_BY_ID_QUERY,
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
      description: product.description,
      images: product.assets
        ? product.assets.map((asset) => ({
            id: asset.preview.split("/").pop(),
            url: asset.preview,
          }))
        : [],
      variants: product.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        price: variant.priceWithTax / 100,
        currencyCode: variant.currencyCode,
        images: variant.assets
          ? variant.assets.map((asset) => ({
              id: asset.preview.split("/").pop(),
              url: asset.preview,
            }))
          : [],
        attributes: variant.options.reduce((atribute, option) => {
          atribute[option.group.name] = option.name;
          return atribute;
        }, {}),
      })),
    };

    return standardizedProduct;
  } catch (error) {
    //console.error("Error in getProductById:", error);
    throw new Error("Failed to fetch product by ID : " + error.message);
  }
}

// Function to fetch and standardize data for collections without caching
async function getCollections(workspaceId) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopProductsQuery.GET_COLLECTIONS_QUERY
    );

    // Create a map to efficiently look up categories by ID
    const categoryMap = {};

    // Populate the category map
    data.data.collections.items.forEach((category) => {
      categoryMap[category.id] = {
        id: category.id,
        name: category.name,
        children: category.children,
      };
    });

    // Function to recursively build the category tree
    function buildCategoryTree(categoryId) {
      const category = categoryMap[categoryId];
      if (category) {
        return {
          id: category.id,
          name: category.name,
          children: category.children.map((child) =>
            buildCategoryTree(child.id)
          ),
        };
      }
      return null;
    }

    // Find the root categories (those with no parent)
    const rootCategories = data.data.collections.items.filter(
      (category) => !category.parent || !categoryMap[category.parent.id]
    );

    // Build the category tree for each root category
    const categoryTree = rootCategories.map((category) =>
      buildCategoryTree(category.id)
    );

    return { categories: categoryTree };
  } catch (error) {
    console.error("Error in getCollections:", error);
    throw new Error("Failed to fetch collections");
  }
}

// Function to fetch and standardize product list from a collection without caching
async function getProductsFromCollection(workspaceId, collectionId) {
  try {
    // Make an authenticated request using VendureClientHandler's automatic re-authentication
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopProductsQuery.GET_PRODUCTS_QUERY,
      {
        collectionId,
      }
    );

    if (!data.data.collection) {
      throw new Error(
        `No products found in collection with ID ${collectionId}`
      );
    }

    // Modify and standardize the products in the response
    const standardizedProducts = data.data.collection.productVariants.items.map(
      (item) => ({
        id: item.product.id,
        name: item.product.name,
        images: item.product.featuredAsset
          ? [
              {
                id: item.product.featuredAsset.id,
                url: item.product.featuredAsset.preview,
              },
            ]
          : [],
        variants: [
          {
            id: item.id,
            price: item.priceWithTax / 100,
            currencyCode: item.currencyCode,
          },
        ],
      })
    );

    return {
      products: standardizedProducts,
    };
  } catch (error) {
    console.error("Error in getProductsFromCollection:", error);
    throw new Error("Failed to fetch products from the collection");
  }
}

module.exports = {
  getProducts,
  getProductById,
  getCollections,
  getProductsFromCollection,
};
