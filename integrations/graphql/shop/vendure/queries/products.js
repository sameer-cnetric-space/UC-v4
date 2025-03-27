const gql = require("graphql-tag");

const GET_PRODUCTS_QUERY = gql`
  query Products {
    products {
      totalItems
      items {
        id
        name
        featuredAsset {
          preview
        }
        facetValues{
          name
        }
        variants{
          id
          name
          currencyCode
          priceWithTax
          featuredAsset{
            preview
          }
        }
        optionGroups{
          name
          options{
            name
          }
        }
        collections{
          id
          name
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_ID_QUERY = gql`
  query Product($productId: ID) {
  product(id: $productId) {
    id
    name
    description
    assets {
      preview
    }
    variants {
      id
      name
      priceWithTax
      currencyCode
      assets {
        preview
      }
      options {
        name
        group {
          name
        }
      }
    }
  }
}
`;

const GET_COLLECTIONS_QUERY = gql`
  query {
    collections {
      items {
        id
        name
        parent {
          id
          name
        }
        children {
          id
          name
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_COLLECTION_QUERY = gql`
  query Collection($collectionId: ID) {
    collection(id: $collectionId) {
      id
      name
      productVariants {
        items {
          product {
            id
            name
            featuredAsset {
              id
              preview
            }
            description
            facetValues{
              name
            }
          }
          id
          name
          currencyCode
          priceWithTax
        }
      }
    }
  }
`;

const shopProductsQuery = {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_ID_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_PRODUCT_BY_COLLECTION_QUERY,

};

module.exports = shopProductsQuery;
