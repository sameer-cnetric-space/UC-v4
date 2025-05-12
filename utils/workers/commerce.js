const Commerce = require("../../models/commerce");

class CommerceWorker {
  static async getACommerce(id) {
    const commerce = await Commerce.findById(id);
    return commerce;
  }
  static async setCommerceData(commerce, data) {
    if (
      commerce.name.toLowerCase() === "vendure" ||
      commerce.name.toLowerCase() === "universal commerce"
    ) {
      const res = {
        name: commerce.name,
        baseUrl: data.commerce.creds.domain,
        adAuth: "",
        adUsername: data.commerce.creds.adminUsername,
        adPassword: data.commerce.creds.adminPassword,
      };
      return res;
    }
    if (commerce.name.toLowerCase() === "shopify") {
      const res = {
        name: commerce.name,
        shopName: data.commerce.creds.shopName,
        storefrontToken: data.commerce.creds.storefrontToken,
        apiVersion: data.commerce.creds.apiVersion,
      };
      return res;
    }
  }
}

module.exports = CommerceWorker;
