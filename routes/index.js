const express = require("express");
const router = express.Router();

// Modular route imports
const userRoutes = require("./user");
//const templateRoutes = require("./template");
const entityRoutes = require("./entity");
const organizationRoutes = require("./organizations/index");

// Route definitions
router.use("/users", userRoutes);
// router.use("/users/templates", templateRoutes);
router.use("/entities", entityRoutes);
router.use("/organizations", organizationRoutes);

module.exports = router;
