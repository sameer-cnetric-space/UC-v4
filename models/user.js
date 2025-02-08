const mongoose = require("mongoose");
const generateUUID = require("../utils/idGenerator");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: function () {
        return generateUUID("usr-"); // Custom prefixed UUID
      },
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]+$/.test(v); // Only allow letters and spaces
        },
        message: "First name must contain only letters and spaces.",
      },
    },
    last_name: {
      type: String,
      trim: true,
      minlength: 2,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]+$/.test(v); // Only allow letters and spaces
        },
        message: "Last name must contain only letters and spaces.",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_]+$/.test(v); // Allow alphanumeric and underscores
        },
        message: "Username can only contain letters, numbers, and underscores.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email format validation
        },
        message: "Invalid email format.",
      },
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\+?[0-9]{7,15}$/.test(v); // Support international phone numbers
        },
        message: "Invalid phone number format.",
      },
    },
    profile_picture: {
      type: String, // URL to profile picture
      default: "/public/assets/entities/user/defUser.jpg", // Replace with your default URL
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Exclude password by default in queries
    },
    salt: {
      type: String,
      required: true,
      select: false, // Exclude salt by default in queries
    },
    role: {
      type: String,
      required: true,
      enum: ["super-admin", "org-admin", "template-admin", "workspace-admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
