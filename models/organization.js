const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const organizationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: function () {
        return generateUUID("org-"); // Custom prefixed UUID
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    users: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
