const shopProductsQuery = require("../queries/products");
const ShopifyClientHandler = require("./client");
// const redisService = require("../../../../../services/redis");

// Function to fetch and standardize product data with caching for productsList in a separate key with 60-second TTL
async function getProducts(workspaceId) {
  try {
    // Make an authenticated request using ShopifyClientHandler's automatic re-authentication
    const data = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopProductsQuery.GET_PRODUCTS_QUERY
    );

    // Modify and standardize the products in the response
    const standardizedProducts = data.products.edges.map(
      ({ node: product }) => ({
        id: product.id,
        name: product.title,
        imageUrl: product.featuredImage?.url || null,
        facetValues: product.tags || [],
        collections: product.collections.edges.map(({ node: collection }) => ({
          id: collection.id,
          name: collection.title,
        })),
        optionGroups: product.options.map((group) => ({
          name: group.name,
          options: group.values,
        })),
        variants: product.variants.edges.map(({ node: variant }) => ({
          id: variant.id,
          name: variant.title,
          currencyCode: variant.price.currencyCode,
          priceWithTax: parseFloat(variant.price.amount), // Assuming tax is included or calculated elsewhere
          imageUrl: variant.image?.url || null,
        })),
      })
    );

    return {
      totalItems: data.products.edges.length,
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
    const data = await ShopifyClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopProductsQuery.GET_PRODUCT_BY_ID_QUERY,
      {
        id: productId,
      }
    );

    // Standardize the product data format
    const product = data.node;

    if (!product || product.__typename !== "Product") {
      throw new Error("Product not found");
    }

    const standardizedProduct = {
      id: product.id,
      name: product.title,
      description: product.description,
      images: product.images.edges.map(({ node }) => ({
        id: node.url.split("/").pop(),
        url: node.url,
      })),
      variants: product.variants.edges.map(({ node: variant }) => ({
        id: variant.id,
        name: variant.title,
        price: parseFloat(variant.price.amount),
        currencyCode: variant.price.currencyCode,
        images: variant.image
          ? [
              {
                id: variant.image.url.split("/").pop(),
                url: variant.image.url,
              },
            ]
          : [],
        attributes: variant.selectedOptions.reduce((attributes, option) => {
          attributes[option.name] = option.value;
          return attributes;
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
    // Make an authenticated request using ShopifyClientHandler's automatic re-authentication
    const data = await ShopifyClientHandler.makeAuthenticatedRequest(
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
    // Make an authenticated request using ShopifyClientHandler's automatic re-authentication
    const data = await ShopifyClientHandler.makeAuthenticatedRequest(
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
