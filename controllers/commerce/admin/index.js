// src/controllers/commerceController.js
const commerceService = require("../../../services/commerce/admin/commerce");

class CommerceController {
  // Controller method to get products list
  async getProductsList(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const productsList = await commerceService.getProductsList(workspaceId);
      res.status(200).json({ products: productsList });
    } catch (error) {
      console.error("Error in getProductsList controller:", error);
      res.status(500).json({ error: "Failed to fetch products list" });
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
      res.status(500).json({ error: "Failed to fetch customers list" });
    }
  }

  // Controller method to get a single customer by ID
  async getCustomerById(req, res) {
    try {
      const { workspace_id, customerId } = req.params;
      const customer = await commerceService.getCustomerById(
        workspace_id,
        customerId
      );
      return res.status(200).json({ customer });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Customer not found" });
      }
      console.error("Error in getCustomerById controller:", error);
      return res.status(500).json({ error: "Failed to fetch customer by ID" });
    }
  }

  // Controller method to get orders list
  async getOrdersList(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const ordersList = await commerceService.getOrdersList(workspaceId);
      res.status(200).json({ orders: ordersList });
    } catch (error) {
      console.error("Error in getOrdersList controller:", error);
      res.status(500).json({ error: "Failed to fetch orders list" });
    }
  }

  // Controller method to get a single order by ID
  async getOrderById(req, res) {
    try {
      const { workspace_id, orderId } = req.params;
      const order = await commerceService.getOrderById(workspace_id, orderId);
      return res.status(200).json({ order });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: "Order not found" });
      }
      console.error("Error in getOrderById controller:", error);
      return res.status(500).json({ error: "Failed to fetch order by ID" });
    }
  }
}

module.exports = new CommerceController();
