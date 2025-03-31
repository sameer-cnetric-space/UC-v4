const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Typesense = require("typesense");
const cors = require("cors");

const app = express();
app.use(cors());
// Configure multer to save files temporarily in the `uploads` folder
const upload = multer({ dest: "uploads/" });

// Typesense configuration
const TYPESENSE_CONFIG = {
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || "4.240.112.193",
      port: process.env.TYPESENSE_PORT || 8108,
      protocol: process.env.TYPESENSE_PROTOCOL || "http",
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY || "xyz",
};

const typesense = new Typesense.Client(TYPESENSE_CONFIG);

// Base schema fields that will be reused
const baseSchemaFields = [
  { name: "id", type: "string", facet: false },
  { name: "name", type: "string", facet: true },
  { name: "featuredAsset.preview", type: "string", facet: false },
  { name: "facetValues.name", type: "string[]", facet: true, optional: true },
  { name: "variants.id", type: "string[]", facet: false },
  { name: "variants.name", type: "string[]", facet: true },
  { name: "variants.currencyCode", type: "string[]", facet: true },
  { name: "variants.priceWithTax", type: "float[]", facet: true },
  {
    name: "variants.featuredAsset.preview",
    type: "string[]",
    facet: false,
    optional: true,
  },
  {
    name: "optionGroups.name",
    type: "string[]",
    facet: true,
    optional: true,
  },
  {
    name: "optionGroups.options.name",
    type: "string[]",
    facet: true,
    optional: true,
  },
  { name: "collections", type: "string[]", facet: false, optional: true },
];

// Middleware to handle JSON requests
app.use(express.json());

/**
 * POST /upload-json
 * Single endpoint that:
 *   1) Creates schema if it does not exist
 *   2) Uploads (imports) the JSON documents
 *
 * Expects form-data:
 *   - "file": the JSON file
 *   - "collectionName": (in body or query)
 */
app.post("/upload-json", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path; // Path of uploaded file
  const originalName = req.file?.originalname;
  const { collectionName } = req.body || req.query;

  if (!filePath) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  if (!collectionName) {
    return res
      .status(400)
      .json({ message: "Missing 'collectionName' in request body or query" });
  }

  try {
    // 1) Read JSON File
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    // Validate JSON structure
    if (!Array.isArray(jsonData)) {
      throw new Error("Uploaded file must contain an array of documents.");
    }

    // 2) Check if schema already exists
    const collections = await typesense.collections().retrieve();
    const schemaExists = collections.some(
      (collection) => collection.name === collectionName
    );

    if (!schemaExists) {
      // Create the schema internally if it doesn't exist
      const newSchema = {
        name: collectionName,
        enable_nested_fields: true,
        fields: baseSchemaFields,
      };

      await typesense.collections().create(newSchema);
      console.log(`Created schema for collection '${collectionName}'`);
    } else {
      console.log(`Schema '${collectionName}' already exists`);
    }

    // 3) Import Documents
    const result = await typesense
      .collections(collectionName)
      .documents()
      .import(jsonData, { action: "upsert" });

    // Cleanup the uploaded file
    fs.unlinkSync(filePath);

    return res.json({
      message: `Data imported into collection '${collectionName}' successfully`,
      result,
      originalName,
      collectionName,
    });
  } catch (error) {
    // Cleanup if error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Error in upload-json:", error);

    return res.status(500).json({
      message: "Error uploading data",
      error: {
        name: error.name || "Error",
        message: error.message || "Unknown error",
      },
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
