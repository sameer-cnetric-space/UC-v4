const gql = require("graphql-tag");

const GET_ORDERS_QUERY = gql`
  query Orders($options: OrderListOptions) {
    orders(options: $options) {
      totalItems
      items {
        id
        state
        orderPlacedAt
        customer {
          firstName
          lastName
        }
        totalWithTax
        lines {
          productVariant {
            name
          }
        }
      }
    }
  }
`;

const GET_ORDER_BY_ID_QUERY = gql`
  query OrderDetailQuery($id: ID!) {
    order(id: $id) {
      id
      orderPlacedAt
      createdAt
      updatedAt
      type
      aggregateOrder {
        id
        code
      }
      sellerOrders {
        id
        code
        channels {
          id
          code
        }
      }
      code
      state
      nextStates
      active
      couponCodes
      customer {
        id
        firstName
        lastName
      }
      lines {
        id
        createdAt
        updatedAt
        featuredAsset {
          preview
        }
        productVariant {
          id
          name
          sku
          featuredAsset {
            preview
          }
          trackInventory
          product {
            featuredAsset {
              preview
            }
          }
        }
        discounts {
          adjustmentSource
          amount
          amountWithTax
          description
          type
        }
        fulfillmentLines {
          fulfillmentId
          quantity
        }
        unitPrice
        unitPriceWithTax
        proratedUnitPrice
        proratedUnitPriceWithTax
        quantity
        orderPlacedQuantity
        linePrice
        lineTax
        linePriceWithTax
        discountedLinePrice
        discountedLinePriceWithTax
      }
      surcharges {
        id
        sku
        description
        price
        priceWithTax
        taxRate
      }
      discounts {
        adjustmentSource
        amount
        amountWithTax
        description
        type
      }
      promotions {
        id
        couponCode
      }
      subTotal
      subTotalWithTax
      total
      totalWithTax
      currencyCode
      shipping
      shippingWithTax
      shippingLines {
        id
        discountedPriceWithTax
        shippingMethod {
          id
          code
          name
          fulfillmentHandlerCode
          description
        }
      }
      taxSummary {
        description
        taxBase
        taxRate
        taxTotal
      }
      shippingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        countryCode
        phoneNumber
      }
      billingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        countryCode
        phoneNumber
      }
      payments {
        id
        createdAt
        transactionId
        amount
        method
        state
        nextStates
        errorMessage
        metadata
        refunds {
          id
          createdAt
          state
          items
          adjustment
          total
          paymentId
          reason
          transactionId
          method
          metadata
          lines {
            orderLineId
            quantity
          }
        }
      }
      fulfillments {
        id
        state
        nextStates
        createdAt
        updatedAt
        method
        lines {
          orderLineId
          quantity
        }
        trackingCode
      }
      modifications {
        id
        createdAt
        isSettled
        priceChange
        note
        payment {
          id
          amount
        }
        lines {
          orderLineId
          quantity
        }
        refund {
          id
          paymentId
          total
        }
        surcharges {
          id
        }
      }
    }
  }
`;

const adminOrdersQuery = {
  GET_ORDERS_QUERY,
  GET_ORDER_BY_ID_QUERY,
};

module.exports = adminOrdersQuery;
