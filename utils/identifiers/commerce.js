const Commerce = require("../../models/commerce");

class Commerce {
  static async getACommerce(id) {
    const commerce = await Commerce.findOne({ where: { id: id } });
    return commerce;
  }
}

module.exports = Commerce;
