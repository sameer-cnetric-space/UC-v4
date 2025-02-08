const Commerce = require("../models/commerce");

const seedCommerce = async () => {
  const data = [
    {
      name: "Universal Commerce",
      description:
        "A seamless, scalable, and modular commerce solution designed to integrate with multiple platforms, streamline transactions, and enhance digital shopping experiences.",
      image_url: "/public/assets/entities/commerce/uc.png",
    },
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
    {
      name: "ShopifyPlus",
      description:
        "An enterprise-level version of Shopify that offers advanced features and customization options for high-volume merchants.",
      image_url: "/public/assets/entities/commerce/shopifyPlus.png",
    },
    {
      name: "Emporix",
      description:
        "A cloud-based commerce platform that enables businesses to create personalized shopping experiences and optimize sales processes.",
      image_url: "/public/assets/entities/commerce/emporix.png",
    },
    {
      name: "Commercetools",
      description:
        "A flexible, API-driven commerce platform that allows businesses to create unique shopping experiences across various channels.",
      image_url: "/public/assets/entities/commerce/commercetools.png",
    },
    {
      name: "HCL Commerce",
      description:
        "A comprehensive commerce platform that helps businesses deliver personalized shopping experiences and drive customer engagement",
      image_url: "/public/assets/entities/commerce/hcl.png",
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
