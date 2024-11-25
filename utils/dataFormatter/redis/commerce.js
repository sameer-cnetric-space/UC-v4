const CommerceIdentifier = require("../../identifiers/commerce");
//first identify commerce
//

async function identifyCommerce(data) {
  const commerce = await CommerceIdentifier.getACommerce(data._id);
  if (commerce) {
    return commerce;
  } else {
    throw new Error("No commerce found");
  }
}
module.exports = { identifyCommerce };
