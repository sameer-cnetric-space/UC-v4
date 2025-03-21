const express = require("express");
const adminRoutes = require("./admin");
const shopRoutes = require("./shop");

const router = express.Router();

// Use admin routes under /admin path
router.use("/admin", adminRoutes);
router.use("/shop", shopRoutes);

module.exports = router;
