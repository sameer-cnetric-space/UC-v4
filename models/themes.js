const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const ThemeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: function () {
        return generateUUID("thm-");
      },
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["B2C", "B2B"],
    },
    image_url: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theme", ThemeSchema);
