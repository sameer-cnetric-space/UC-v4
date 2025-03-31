const VendureClientHandler = require("./client");
const shopCheckoutQuery = require("../queries/checkout");

async function getShippingMethods(workspaceId, customerToken) {
  try {
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCheckoutQuery.GET_ELIGIBLE_SHIPPING_METHODS_QUERY,
      {},
      customerToken
    );

    return data.eligibleShippingMethods.map((method) =>
      parseInt(method.id, 10)
    );
  } catch (error) {
    console.error("Error in getShippingMethods:", error);
    throw new Error("Failed to fetch shipping methods.");
  }
}

async function setShippingMethod(
  workspaceId,
  shippingMethodIds,
  customerToken
) {
  try {
    return await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCheckoutQuery.SET_SHIPPING_METHOD_MUTATION,
      { shippingMethodIds },
      customerToken,
      "mutation"
    );
  } catch (error) {
    console.error("Error in setShippingMethod:", error);
    throw new Error("Failed to set shipping methods.");
  }
}

async function setOrderBillingAddress(workspaceId, payload, customerToken) {
  try {
    const address = {
      fullName:
        payload.address.firstName + " " + payload.address.lastName || "",

      company: payload.address.landmark,

      streetLine1: payload.address.streetLine1,

      streetLine2: payload.address.streetLine2,

      city: payload.address.city,

      province: payload.address.state,

      postalCode: payload.address.postalCode,

      countryCode: payload.address.countryCode,

      phoneNumber: payload.address.phoneNumber,
    };
    return await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCheckoutQuery.SET_ORDER_BILLING_ADDRESS_MUTATION,
      { input: address },
      customerToken,
      "mutation"
    );
  } catch (error) {
    console.error("Error in setOrderBillingAddress:", error);
    throw new Error("Failed to set billing address.");
  }
}

async function setOrderShippingAddress(workspaceId, payload, customerToken) {
  try {
    const address = {
      fullName:
        payload.address.firstName + " " + payload.address.lastName || "",

      company: payload.address.landmark,

      streetLine1: payload.address.streetLine1,

      streetLine2: payload.address.streetLine2 || "",

      city: payload.address.city,

      province: payload.address.state,

      postalCode: payload.address.postalCode,

      countryCode: payload.address.countryCode,

      phoneNumber: payload.address.phoneNumber,
    };
    return await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCheckoutQuery.SET_ORDER_SHIPPING_ADDRESS_MUTATION,
      { input: address },
      customerToken,
      "mutation"
    );
  } catch (error) {
    console.error("Error in setOrderShippingAddress:", error);
    throw new Error("Failed to set shipping address.");
  }
}

async function transitionOrderToState(workspaceId, customerToken) {
  try {
    return await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCheckoutQuery.TRANSITION_ORDER_STATE_MUTATION,
      { state: "ArrangingPayment" },
      customerToken,
      "mutation"
    );
  } catch (error) {
    console.error("Error in transitionOrderToState:", error);
    throw new Error("Failed to transition order state.");
  }
}

async function addPaymentToOrder(workspaceId, customerToken) {
  try {
    const data = await VendureClientHandler.makeAuthenticatedRequest(
      workspaceId,
      shopCheckoutQuery.ADD_PAYMENT_TO_ORDER_MUTATION,
      {
        //method: "connected-payment-method",
        method: "standard-payment",
        metadata: {},
      },
      customerToken,
      "mutation"
    );

    return { orderId: data.addPaymentToOrder.id };
  } catch (error) {
    console.error("Error in addPaymentToOrder:", error);
    throw new Error("Failed to add payment.");
  }
}

async function setOrderShippingMethod(workspaceId, customerToken) {
  try {
    const eligibleShipping = await getShippingMethods(
      workspaceId,
      customerToken
    );
    return await setShippingMethod(
      workspaceId,
      eligibleShipping,
      customerToken
    );
  } catch (error) {
    console.error("Error in setOrderShippingMethod:", error);
    throw new Error("Failed to set order shipping method.");
  }
}

async function setPayment(workspaceId, customerToken) {
  try {
    // Introduce a 500ms delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    await transitionOrderToState(workspaceId, customerToken);
    return await addPaymentToOrder(workspaceId, customerToken);
  } catch (error) {
    console.error("Error in setPayment:", error);
    throw new Error("Failed to set payment method.");
  }
}

/**
 * Runs all order checkout steps in parallel.
 */
async function processFullCheckout(workspaceId, address, customerToken) {
  try {
    const [_, billingResponse, shippingResponse, paymentResponse] =
      await Promise.all([
        setOrderShippingMethod(workspaceId, customerToken),
        setOrderBillingAddress(workspaceId, address, customerToken),
        setOrderShippingAddress(workspaceId, address, customerToken),
        setPayment(workspaceId, customerToken),
      ]);

    return paymentResponse;
  } catch (error) {
    console.error("Error in processFullCheckout:", error);
    throw new Error("Checkout process failed.");
  }
}

module.exports = {
  processFullCheckout,
};
