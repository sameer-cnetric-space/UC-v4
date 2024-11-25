const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const workspaceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: function () {
        return generateUUID("wsp-");
      },
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    description: {
      type: String,
      default: "Streamline your operations with this all-in-one workspace.",
    },
    commerce: {
      commerce_id: {
        type: String,
        required: true,
      },
      creds: {
        type: Object,
        required: true,
      },
    },
    cms: {
      cms_id: {
        type: String,
        required: true,
      },
      creds: {
        type: Object,
        required: true,
      },
    },
    payment: [
      {
        payment_id: {
          type: String,
          required: true,
        },
        creds: {
          type: Object,
          required: true,
        },
        _id: false,
      },
    ],
    crm: {
      crm_id: {
        type: String,
      },
      creds: {
        type: Object,
      },
    },
    search: {
      search_id: {
        type: String,
        required: true,
      },
      creds: {
        type: Object,
        required: true,
      },
    },
    composer_url: {
      type: String,
      default: "https://universalcomposer.com",
    },
    user_id: {
      type: String,
      required: true,
    },
    template_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model("Workspace", workspaceSchema);
