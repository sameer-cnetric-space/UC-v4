const Template = require("../models/template");
const SeedTemplateHandler = require("../handlers/seed/templates");

const seedTemplates = async () => {
  let expressData;

  // Check if the "Express Edition" template already exists
  const existingTemplate = await Template.findOne({ name: "Express Edition" });

  if (!existingTemplate) {
    // Fetch the expressData only when "Express Edition" is not found
    expressData = await SeedTemplateHandler.expressTemplateData();
  }

  const data = existingTemplate
    ? [] // If the template exists, do not add anything
    : [
        {
          name: "Express Edition",
          description: "This is the template for Express Edition",
          bModel_id: expressData.bModelId,
          type: "Preset",
          commerce_id: expressData.commerceId,
          cms_id: expressData.cmsId,
          search_id: expressData.searchId,
          payment_ids: expressData.paymentIds,
        },
      ];

  try {
    // Insert the new data only if it's defined
    if (data.length > 0) {
      await Template.insertMany(data);
      console.log("Predefined Templates added successfully.");
    } else {
      console.log("No new templates to seed.");
    }
  } catch (error) {
    console.error("Error initializing Templates:", error);
  }
};

module.exports = {
  seedTemplates,
};
