const express = require("express");
const commerceController = require("../../../controllers/commerce/shop/index");

const router = express.Router({ mergeParams: true });

// Define routes for authentication
router.post("/login", commerceController.customerLogin);
router.post("/register", commerceController.registerCustomer);

// Define routes for products
router.get("/products", commerceController.getProductsList);
router.get("/products/:productId", commerceController.getProductById);

// Define routes for customers
//router.get("/customers", commerceController.getCustomersList);
router.get("/me", commerceController.activeCustomer);

// Define routes for orders
router.get("/orders", commerceController.getOrdersList);
router.get("/orders/:orderId", commerceController.getOrderById);

// Define routes for cart
router.get("/cart", commerceController.getCart);
router.post("/cart/create", commerceController.createCart);
router.post("/cart", commerceController.addToCart);
router.put("/cart", commerceController.updateCart);
router.delete("/cart", commerceController.removeFromCart);

router.post("/checkout", commerceController.checkout);

module.exports = router;
