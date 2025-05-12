const RedisService = require("../../redis");

class CommerceService {
  constructor() {
    this.integrators = {
      vendure: require("../../../integrations/graphql/shop/vendure/integrator"),
      shopify: require("../../../integrations/graphql/shop/shopify/integrator"),
    };

    // Will be dynamically assigned per workspace
    this.integrator = null;
  }

  // Dynamically set the integrator based on workspace
  async setIntegrator(workspaceId) {
    const env = await RedisService.getEnv(workspaceId);
    let provider = env?.commerce?.name?.toLowerCase();
    if (provider === "universal commerce") {
      provider = "vendure";
    }

    if (!provider || !this.integrators[provider]) {
      throw new Error(`Unsupported or missing commerce provider: ${provider}`);
    }

    this.integrator = this.integrators[provider];
  }

  // Fetches products list with caching via the products handler
  async getProductsList(workspaceId) {
    try {
      await this.setIntegrator(workspaceId);
      const productsList = await this.integrator.execute(
        "products",
        "getProducts",
        workspaceId
      );
      return productsList;
    } catch (error) {
      console.error("Error in getProductsList:", error);
      throw new Error("Failed to fetch products list");
    }
  }

  // Fetches a single product by ID via the products handler
  async getProductById(workspaceId, productId) {
    try {
      await this.setIntegrator(workspaceId);

      const product = await this.integrator.execute(
        "products",
        "getProductById",
        workspaceId,
        productId
      );
      return product;
    } catch (error) {
      // console.error("Error in getProductById:", error);
      throw new Error("Failed to fetch product by ID: " + error.message);
    }
  }

  // Fetches customers list via the customers handler
  async getCustomersList(workspaceId) {
    try {
      await this.setIntegrator(workspaceId);

      const customersList = await this.integrator.execute(
        "customers",
        "getCustomers",
        workspaceId
      );
      return customersList;
    } catch (error) {
      console.error("Error in getCustomersList:", error);
      throw new Error("Failed to fetch customers list");
    }
  }

  // Fetches a single customer by ID via the customers handler
  async getActiveCustomer(workspaceId, token) {
    try {
      await this.setIntegrator(workspaceId);

      const customer = await this.integrator.execute(
        "customers",
        "getUserDetails",
        workspaceId,
        token
      );
      return customer;
    } catch (error) {
      // console.error("Error in getCustomerById:", error);
      throw new Error("Failed to fetch customer by ID : " + error.message);
    }
  }

  async getCustomerToken(workspaceId, payload) {
    try {
      await this.setIntegrator(workspaceId);

      const login = await this.integrator.execute(
        "auth",
        "customerLogin",
        workspaceId,
        payload
      );
      return login;
    } catch (error) {
      //console.error("Error in login:", error);
      throw new Error("Failed to fetch token : " + error.message);
    }
  }

  async registerCustomer(workspaceId, payload) {
    try {
      await this.setIntegrator(workspaceId);

      const register = await this.integrator.execute(
        "auth",
        "customerRegister",
        workspaceId,
        payload
      );
      return register;
    } catch (error) {
      //console.error("Error to register:", error);
      throw new Error("Failed to register : " + error.message);
    }
  }

  async getCustomerCart(workspaceId, customerToken, extraArgs) {
    try {
      await this.setIntegrator(workspaceId);

      const cart = await this.integrator.execute(
        "cart",
        "getActiveCart",
        workspaceId,
        customerToken,
        extraArgs
      );
      return cart;
    } catch (error) {
      //console.error("Error in getOrdersList:", error);
      throw new Error("Failed to fetch cart : " + error.message);
    }
  }

  async createCustomerCart(workspaceId, payload, customerToken, extraArgs) {
    try {
      await this.setIntegrator(workspaceId);

      const cart = await this.integrator.execute(
        "cart",
        "createCart",
        workspaceId,
        payload,
        customerToken,
        extraArgs
      );
      return cart;
    } catch (error) {
      //console.error("Error in getOrdersList:", error);
      throw new Error("Failed to add to cart : " + error.message);
    }
  }

  async addToCustomerCart(workspaceId, payload, customerToken, extraArgs) {
    try {
      await this.setIntegrator(workspaceId);

      const cart = await this.integrator.execute(
        "cart",
        "addItemToCart",
        workspaceId,
        payload,
        customerToken,
        extraArgs
      );
      return cart;
    } catch (error) {
      //console.error("Error in getOrdersList:", error);
      throw new Error("Failed to add to cart : " + error.message);
    }
  }

  async updateCustomerCart(workspaceId, payload, customerToken, extraArgs) {
    try {
      await this.setIntegrator(workspaceId);

      const cart = await this.integrator.execute(
        "cart",
        "adjustOrderLine",
        workspaceId,
        payload,
        customerToken,
        extraArgs
      );
      return cart;
    } catch (error) {
      //console.error("Error in getOrdersList:", error);
      throw new Error("Failed to update cart : " + error.message);
    }
  }

  async removeFromCustomerCart(
    workspaceId,
    orderLineId,
    customerToken,
    extraArgs
  ) {
    try {
      await this.setIntegrator(workspaceId);

      const cart = await this.integrator.execute(
        "cart",
        "removeOrderLine",
        workspaceId,
        orderLineId,
        customerToken,
        extraArgs
      );
      return cart;
    } catch (error) {
      //console.error("Error in getOrdersList:", error);
      throw new Error("Failed to update cart : " + error.message);
    }
  }

  async customerCheckout(workspaceId, payload, customerToken, extraArgs) {
    try {
      await this.setIntegrator(workspaceId);

      const cart = await this.integrator.execute(
        "checkout",
        "processFullCheckout",
        workspaceId,
        payload,
        customerToken,
        extraArgs
      );
      return cart;
    } catch (error) {
      //console.error("Error in getOrdersList:", error);
      throw new Error("Failed to update cart : " + error.message);
    }
  }

  // Fetches orders list via the orders handler
  async getOrdersList(workspaceId, customerToken) {
    try {
      await this.setIntegrator(workspaceId);

      const ordersList = await this.integrator.execute(
        "orders",
        "getOrders",
        workspaceId,
        customerToken
      );
      return ordersList;
    } catch (error) {
      //console.error("Error in getOrdersList:", error);
      throw new Error("Failed to fetch orders list : " + error.message);
    }
  }

  // Fetches a single order by ID via the orders handler
  async getOrderById(workspaceId, orderId, customerToken) {
    try {
      await this.setIntegrator(workspaceId);

      const order = await this.integrator.execute(
        "orders",
        "getOrderById",
        workspaceId,
        orderId,
        customerToken
      );
      return order;
    } catch (error) {
      // console.error("Error in getOrderById:", error);
      throw new Error("Failed to fetch order by ID :" + error.message);
    }
  }
}

module.exports = new CommerceService();
