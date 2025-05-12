// src/controllers/commerceController.js
const commerceService = require("../../../services/commerce/shop/commerce");

class CommerceController {
  // Controller method to get products list
  async getProductsList(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const productsList = await commerceService.getProductsList(workspaceId);
      res.status(200).json({ products: productsList });
    } catch (error) {
      console.error("Error in getProductsList controller:", error);
      res.status(500).json({
        error: "Failed to fetch products list",
        message: error.message,
      });
    }
  }

  // Controller method to get a single product by ID
  async getProductById(req, res) {
    try {
      const { workspace_id, productId } = req.params;
      const product = await commerceService.getProductById(
        workspace_id,
        productId
      );
      return res.status(200).json({ product: product });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.error("Error in getProductById controller:", error);
      return res.status(500).json({
        error: "Failed to fetch product by ID",
        message: error.message,
      });
    }
  }

  // Controller method to get customers list
  async getCustomersList(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customersList = await commerceService.getCustomersList(workspaceId);
      res.status(200).json({ customers: customersList });
    } catch (error) {
      console.error("Error in getCustomersList controller:", error);
      res.status(500).json({
        error: "Failed to fetch customers list",
        message: error.message,
      });
    }
  }

  // Controller method to get a single customer by ID
  async activeCustomer(req, res) {
    try {
      const { workspace_id } = req.params;
      const customerToken = req.headers["token"];
      const customer = await commerceService.getActiveCustomer(
        workspace_id,
        customerToken
      );
      return res.status(200).json(customer);
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Customer not found" });
      }
      console.error("Error in getCustomerById controller:", error);
      return res.status(500).json({
        error: "Failed to fetch customer by ID",
        message: error.message,
      });
    }
  }

  async customerLogin(req, res) {
    try {
      const { workspace_id } = req.params;
      const { email, password } = req.body;
      const customer = await commerceService.getCustomerToken(workspace_id, {
        email,
        password,
      });
      return res.status(200).json(customer);
    } catch (error) {
      if (error.message.includes("Invalid credentials")) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      //console.error("Error in getCustomerById controller:", error);
      return res.status(500).json({
        error: "Failed to login",
        message: error.message,
      });
    }
  }

  async registerCustomer(req, res) {
    try {
      const { workspace_id } = req.params;
      const payload = req.body;
      const customer = await commerceService.registerCustomer(
        workspace_id,
        payload
      );
      return res.status(201).json(customer);
    } catch (error) {
      //console.error("Error in registerCustomer controller:", error);
      if (error.message.includes("already exists")) {
        return res.status(409).json({ message: "Email already registered" });
      }

      if (error.message.includes("registration failed")) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        error: "Failed to login",
        message: error.message,
      });
    }
  }

  async getCart(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customerToken = req.headers["token"];
      const extraArgs = { cartId: req.query.cartId };

      const cart = await commerceService.getCustomerCart(
        workspaceId,
        customerToken,
        extraArgs
      );
      res.status(200).json(cart);
    } catch (error) {
      //console.error("Error in cart controller:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res
        .status(500)
        .json({ error: "Failed to fetch cart", message: error.message });
    }
  }
  async createCart(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customerToken = req.headers["token"];
      const payload = req.body;
      const cart = await commerceService.createCustomerCart(
        workspaceId,
        payload,
        customerToken
      );
      res.status(201).json(cart);
    } catch (error) {
      //console.error("Error in cart controller:", error);

      res
        .status(500)
        .json({ error: "Failed to fetch cart", message: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customerToken = req.headers["token"];
      const payload = req.body;
      const extraArgs = { cartId: req.query.cartId };
      const cart = await commerceService.addToCustomerCart(
        workspaceId,
        payload,
        customerToken,
        extraArgs
      );
      res.status(201).json(cart);
    } catch (error) {
      //console.error("Error in cart controller:", error);

      res
        .status(500)
        .json({ error: "Failed to fetch cart", message: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customerToken = req.headers["token"];
      const payload = req.body;
      const extraArgs = { cartId: req.query.cartId };
      const cart = await commerceService.updateCustomerCart(
        workspaceId,
        payload,
        customerToken,
        extraArgs
      );
      res.status(200).json(cart);
    } catch (error) {
      //console.error("Error in cart controller:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res
        .status(500)
        .json({ error: "Failed to fetch cart", message: error.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customerToken = req.headers["token"];
      const extraArgs = { cartId: req.query.cartId };

      const { orderLineId } = req.body;
      const cart = await commerceService.removeFromCustomerCart(
        workspaceId,
        orderLineId,
        customerToken,
        extraArgs
      );
      res.status(200).json(cart);
    } catch (error) {
      //console.error("Error in cart controller:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res
        .status(500)
        .json({ error: "Failed to fetch cart", message: error.message });
    }
  }

  async checkout(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customerToken = req.headers["token"];
      const payload = req.body;
      const extraArgs = { cartId: req.query.cartId };

      const checkout = await commerceService.customerCheckout(
        workspaceId,
        payload,
        customerToken,
        extraArgs
      );
      res.status(200).json(checkout);
    } catch (error) {
      //console.error("Error in cart controller:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res
        .status(500)
        .json({ error: "Failed to checkout", message: error.message });
    }
  }

  // Controller method to get orders list
  async getOrdersList(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const customerToken = req.headers["token"];
      const ordersList = await commerceService.getOrdersList(
        workspaceId,
        customerToken
      );
      res.status(200).json({ orders: ordersList });
    } catch (error) {
      //console.error("Error in getOrdersList controller:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Orders not found" });
      }
      res
        .status(500)
        .json({ error: "Failed to fetch orders list", message: error.message });
    }
  }

  // Controller method to get a single order by ID
  async getOrderById(req, res) {
    try {
      const { workspace_id, orderId } = req.params;
      const customerToken = req.headers["token"];

      const order = await commerceService.getOrderById(
        workspace_id,
        orderId,
        customerToken
      );
      return res.status(200).json({ order });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Order not found" });
      }
      console.error("Error in getOrderById controller:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch order by ID", message: error.message });
    }
  }
}

module.exports = new CommerceController();
