const express = require("express");
const router = express.Router();

// Modular route imports
const userRoutes = require("./user");
const templateRoutes = require("./template");
const workspaceRoutes = require("./workspace");
const entityRoutes = require("./entity");

// Route definitions
router.use("/users", userRoutes);
router.use("/users/templates", templateRoutes);
router.use("/users/workspaces", workspaceRoutes);
router.use("/entities", entityRoutes);

module.exports = router;
