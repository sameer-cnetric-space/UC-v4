const BModel = require("../models/bModel");
const seedBModels = async () => {
  const data = [
    {
      name: "B2C",
      description: "A Business to Consumer model",
    },
    {
      name: "B2B",
      description: "A Business to Business model",
    },
  ];

  try {
    // Check if any data already exist
    const existingBModels = await BModel.find();
    if (existingBModels.length === 0) {
      // Insert predefined BModels
      await BModel.insertMany(data);
      console.log("Predefined BModels added successfully.");
    }
  } catch (error) {
    console.error("Error initializing BModels:", error);
  }
};

module.exports = {
  seedBModels,
};
