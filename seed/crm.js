const CRM = require("../models/crm");

const seedCRM = async () => {
  const data = [
    {
      name: "Zoho",
      description:
        "A cloud-based suite of software solutions that provides CRM, productivity, and business management tools for businesses of all sizes.",
      image_url: "/public/assets/entities/crm/zoho.png",
    },
    {
      name: "Hubspot",
      description:
        "A comprehensive CRM platform offering tools for marketing, sales, customer service, and content management to help businesses grow and engage customers.",
      image_url: "/public/assets/entities/crm/hubspot.png",
    },
  ];

  try {
    // Check if any data already exist
    const existingCRM = await CRM.find();
    if (existingCRM.length === 0) {
      // Insert predefined CRM
      await CRM.insertMany(data);
      console.log("Predefined CRM added successfully.");
    }
  } catch (error) {
    console.error("Error initializing CRM:", error);
  }
};

module.exports = {
  seedCRM,
};
