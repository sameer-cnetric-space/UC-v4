const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const SearchSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: function () {
        return generateUUID("sr-");
      },
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Search", SearchSchema);
