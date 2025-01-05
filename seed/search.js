const Search = require("../models/search");

const seedSearch = async () => {
  const data = [
    {
      name: "Algolia",
      description:
        "A powerful search-as-a-service platform offering fast, scalable, and customizable search and discovery experiences via APIs.",
      image_url: "/public/assets/entities/search/algolia.png",
    },
    {
      name: "Typesense",
      description:
        "An open-source, fast, typo-tolerant search engine optimized for instant, real-time search experiences.",
      image_url: "/public/assets/entities/search/typesense.png",
    },
    {
      name: "Lumina",
      description:
        "An AI-driven search platform that enhances search accuracy and relevance by leveraging machine learning and natural language processing.",
      image_url: "/public/assets/entities/search/lumina.png",
    },
  ];

  try {
    // Check if any data already exist
    const existingSearch = await Search.find();
    if (existingSearch.length === 0) {
      // Insert predefined Search
      await Search.insertMany(data);
      console.log("Predefined Search added successfully.");
    }
  } catch (error) {
    console.error("Error initializing Search:", error);
  }
};

module.exports = {
  seedSearch,
};
