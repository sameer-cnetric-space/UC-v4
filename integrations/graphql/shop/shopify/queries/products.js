const gql = require("graphql-tag");

const GET_PRODUCTS_QUERY = gql`
  query products {
    products(first: 100) {
      edges {
        node {
          id
          handle
          title
          description
          featuredImage {
            url
          }
          tags
          options {
            name
            values
          }
          collections(first: 10) {
            edges {
              node {
                id
                handle
                title
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                }
                quantityAvailable
              }
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_ID_QUERY = gql`
  query getProductById($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        title
        description
        featuredImage {
          url
        }
        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }
        options {
          name
          values
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                url
              }
              selectedOptions {
                name
                value
              }
            }
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
            facetValues {
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
