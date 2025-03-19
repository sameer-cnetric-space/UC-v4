const Themes = require("../models/themes");

const seedThemes = async () => {
  const data = [
    {
      name: "Luxera",
      description:
        "An elegant storefront template designed for luxury brands and premium products.",
      type: "B2C",
      image_url: "/public/assets/default.png",
    },
    {
      name: "Bizora",
      description:
        "A professional storefront template ideal for business and corporate retail.",
      type: "B2C",
      image_url: "/public/assets/default.png",
    },
    {
      name: "Supra",
      description:
        "A high-performance storefront template for automotive and sports brands.",
      type: "B2C",
      image_url: "/public/assets/default.png",
    },
  ];

  try {
    // Check if any data already exist
    const existingThemes = await Themes.find();
    if (existingThemes.length === 0) {
      // Insert predefined Themes
      await Themes.insertMany(data);
      console.log("Predefined Themes added successfully.");
    }
  } catch (error) {
    console.error("Error initializing Payment:", error);
  }
};

module.exports = {
  seedThemes,
};
