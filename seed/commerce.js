const Commerce = require("../models/commerce");

const seedCommerce = async () => {
  const data = [
    {
      name: "Vendure",
      description:
        "A modern, headless, open-source framework for building eCommerce applications with GraphQL APIs.",
      image_url: "/public/assets/entities/commerce/vendure.png",
    },
    {
      name: "Shopify",
      description:
        "A popular all-in-one eCommerce platform for building, managing, and scaling online stores.",
      image_url: "/public/assets/entities/commerce/shopify.png",
    },
  ];

  try {
    // Check if any data already exist
    const existingCommerce = await Commerce.find();
    if (existingCommerce.length === 0) {
      // Insert predefined Commerce
      await Commerce.insertMany(data);
      console.log("Predefined Commerce added successfully.");
    }
  } catch (error) {
    console.error("Error initializing Commerce:", error);
  }
};

module.exports = {
  seedCommerce,
};
