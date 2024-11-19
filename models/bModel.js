const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const bModel = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: function () {
        return generateUUID("bm-");
      },
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bModel", bModel);
