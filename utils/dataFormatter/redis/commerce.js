const CommerceIdentifier = require("../../workers/commerce");

async function identifyCommerce(id) {
  const commerce = await CommerceIdentifier.getACommerce(id);
  if (!commerce) {
    throw new Error(`No commerce found for ID: ${id}`);
  }
  return commerce;
}

async function formatCommerce(data) {
  try {
    // Identify the commerce type using the provided ID
    const commerce = await identifyCommerce(data.commerce.commerce_id);

    // Set and format commerce-specific data
    const formattedCommerce = await CommerceIdentifier.setCommerceData(
      commerce,
      data
    );

    // Build the final formatted structure
    const formattedData = {
      commerce: formattedCommerce,
      cms: {}, // Placeholder for CMS data, can be filled as needed
      search: {}, // Placeholder for search data
      payment: [], // Placeholder for payment data
      crm: {}, // Placeholder for CRM data
    };

    return formattedData;
  } catch (error) {
    console.error("Error formatting commerce data:", error.message);
    throw error; // Re-throw the error to allow handling at a higher level
  }
}

module.exports = { identifyCommerce, formatCommerce };
