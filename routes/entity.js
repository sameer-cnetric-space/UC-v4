const express = require("express");
const EntityController = require("../controllers/entity");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, EntityController.getEntities);

module.exports = router;
