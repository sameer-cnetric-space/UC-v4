const CMS = require("../models/cms");

const seedCMS = async () => {
  const data = [
    {
      name: "Strapi",
      description:
        "An open-source, headless CMS that allows developers to build APIs with ease, offering customizable content management.",
      image_url: "/public/assets/entities/cms/strapi.png",
    },
    {
      name: "Contentful",
      description:
        "A headless CMS offering API-driven content management and delivery for websites and applications.",
      image_url: "/public/assets/entities/cms/contentful.png",
    },
    {
      name: "HCL DX",
      description:
        "A digital experience platform that enables businesses to create, manage, and deliver engaging digital experiences.",
      image_url: "/public/assets/entities/cms/hcl.png",
    },
  ];

  try {
    // Check if any data already exist
    const existingCMS = await CMS.find();
    if (existingCMS.length === 0) {
      // Insert predefined CMS
      await CMS.insertMany(data);
      console.log("Predefined CMS added successfully.");
    }
  } catch (error) {
    console.error("Error initializing CMS:", error);
  }
};

module.exports = {
  seedCMS,
};
