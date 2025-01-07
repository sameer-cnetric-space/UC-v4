const express = require("express");
const commerceController = require("../../../controllers/commerce/admin/index");

const router = express.Router({ mergeParams: true });

// Define routes for products
router.get("/products", commerceController.getProductsList);
router.get("/products/:productId", commerceController.getProductById);

// Define routes for customers
router.get("/customers", commerceController.getCustomersList);
router.get("/customers/:customerId", commerceController.getCustomerById);

// Define routes for orders
router.get("/orders", commerceController.getOrdersList);
router.get("/orders/:orderId", commerceController.getOrderById);

module.exports = router;
