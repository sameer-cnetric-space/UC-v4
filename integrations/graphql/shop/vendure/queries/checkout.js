const gql = require("graphql-tag");

const GET_ELIGIBLE_SHIPPING_METHODS_QUERY = gql`
  query Query {
    eligibleShippingMethods {
      id
      price
      priceWithTax
      code
      name
      description
      metadata
      customFields
    }
  }
`;

const SET_SHIPPING_METHOD_MUTATION = gql`
  mutation SetOrderShippingMethod($shippingMethodIds: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodIds) {
      ... on Order {
        id
        createdAt
        updatedAt
        type
        orderPlacedAt
        code
        state
        active
        totalQuantity
        subTotal
        subTotalWithTax
        currencyCode
        shipping
        shippingWithTax
        total
        totalWithTax
      }
      ... on OrderModificationError {
        errorCode
        message
      }
      ... on IneligibleShippingMethodError {
        errorCode
        message
      }
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`;

const SET_ORDER_BILLING_ADDRESS_MUTATION = gql`
  mutation SetOrderBillingAddress($input: CreateAddressInput!) {
    setOrderBillingAddress(input: $input) {
      ... on Order {
        id
        code
        state
        active
        subTotal
        total
      }
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`;

const SET_ORDER_SHIPPING_ADDRESS_MUTATION = gql`
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order {
        id
        code
        state
        active
        subTotal
        total
      }
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`;

const TRANSITION_ORDER_STATE_MUTATION = gql`
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order {
        id
        code
        state
        active
        subTotal
        total
        totalQuantity
        shipping
        shippingAddress {
          streetLine1
          streetLine2
          province
          postalCode
          country
        }
      }
      ... on OrderStateTransitionError {
        errorCode
        message
        fromState
        toState
        transitionError
      }
    }
  }
`;

const ADD_PAYMENT_TO_ORDER_MUTATION = gql`
  mutation AddPaymentToOrder($method: String!, $metadata: JSON!) {
    addPaymentToOrder(input: { method: $method, metadata: $metadata }) {
      ... on Order {
        id
        code
        type
        state
        active
        billingAddress {
          country
          postalCode
          province
          streetLine1
          streetLine2
        }
        totalQuantity
        totalWithTax
        subTotalWithTax
        shippingWithTax
        customer {
          firstName
          phoneNumber
          emailAddress
        }
        orderPlacedAt
      }
      ... on OrderPaymentStateError {
        errorCode
        message
      }
      ... on IneligiblePaymentMethodError {
        errorCode
        message
        eligibilityCheckerMessage
      }
      ... on PaymentFailedError {
        errorCode
        message
        paymentErrorMessage
      }
      ... on PaymentDeclinedError {
        errorCode
        message
        paymentErrorMessage
      }
      ... on OrderStateTransitionError {
        errorCode
        message
        transitionError
        fromState
        toState
      }
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`;

const shopCheckout = {
  GET_ELIGIBLE_SHIPPING_METHODS_QUERY,
  SET_SHIPPING_METHOD_MUTATION,
  SET_ORDER_BILLING_ADDRESS_MUTATION,
  SET_ORDER_SHIPPING_ADDRESS_MUTATION,
  TRANSITION_ORDER_STATE_MUTATION,
  ADD_PAYMENT_TO_ORDER_MUTATION,
};

module.exports = shopCheckout;
