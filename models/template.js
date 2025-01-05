const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const templateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: function () {
        return generateUUID("tmp-"); // Custom prefixed UUID
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: "An ideal starting point for your project design.",
    },
    user_id: {
      type: String,
      required: function () {
        return this.type === "Custom"; // Only required for custom templates
      },
    },
    bModel_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Custom", "Preset"],
      required: true,
      default: "Custom", // Default type
    },
    commerce_id: {
      type: String,
      required: true,
    },
    cms_id: {
      type: String,
      required: true,
    },
    search_id: {
      type: String,
      required: true,
    },
    payment_ids: {
      type: [String],
      required: true,
      validate: {
        validator: function (array) {
          return array.length > 0; // At least one payment ID is required
        },
        message: "At least one payment ID is required.",
      },
    },
    crm_id: {
      type: String,
      required: false, // CRM is optional
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // Flexible field for storing additional info
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Template", templateSchema);
