const express = require("express");
const { entities } = require("../controllers/entity");
const imageURLGeneration = require("../utils/imageMapping");

const router = express.Router();

router.get("/", imageURLGeneration, entities);

module.exports = router;
