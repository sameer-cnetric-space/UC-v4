const express = require("express");
const EntityController = require("../controllers/entity");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, EntityController.getEntities);
router.get("/:type/:id", auth, EntityController.getEntityById);
router.get("/themes", auth, EntityController.getThemes);

module.exports = router;
