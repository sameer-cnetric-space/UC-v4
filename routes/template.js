// const express = require("express");
// const authMiddleware = require("../middlewares/auth");
// const TemplateController = require("../controllers/template");
// const entityChecker = require("../middlewares/entityChecker");
// const bModel = require("../models/bModel");
// const CMS = require("../models/cms");
// const Commerce = require("../models/commerce");
// const CRM = require("../models/crm");
// const Payment = require("../models/payments");
// const Search = require("../models/search");
// const validate = require("../middlewares/validate");
// const { templateSchema } = require("../validations/templates");

// const router = express.Router();

// // Utility to define entity models dynamically
// const entityModels = [
//   { model: bModel, idFieldName: "bModel_id" },
//   { model: CMS, idFieldName: "cms_id" },
//   { model: Commerce, idFieldName: "commerce_id" },
//   { model: CRM, idFieldName: "crm_id" },
//   { model: Payment, idFieldName: "payment_id" },
//   { model: Search, idFieldName: "search_id" },
// ];

// // Middleware for extracting `tempId` and injecting it into `req`
// router.param("tempId", (req, res, next, tempId) => {
//   req.tempId = tempId;
//   next();
// });

// // Create a new template
// router.post(
//   "/",
//   authMiddleware,
//   entityChecker(entityModels), // Check for required entities
//   validate(templateSchema), // Validate incoming data
//   TemplateController.createTemplate
// );

// // Fetch all templates for the authenticated user
// router.get("/", authMiddleware, TemplateController.getAllUserTemplates);

// // Fetch a specific template by its ID
// router.get("/:id", authMiddleware, TemplateController.getTemplateById);

// // Update an existing template
// router.put(
//   "/:id",
//   authMiddleware,
//   validate(templateSchema), // Validate updated data
//   TemplateController.updateTemplate
// );

// // Delete a template
// router.delete("/:id", authMiddleware, TemplateController.deleteTemplate);

// // Nested routes for workspaces associated with a template
// //router.use("/:tempId/workspaces", require("./workspaceRoutes"));

// module.exports = router;

const express = require("express");
const { templateEntityCheck } = require("../utils/entityCheckConfig");
const TemplateController = require("../controllers/template");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const {
  templateSchema,
  templateUpdateSchema,
} = require("../validations/templates");

const router = express.Router({ mergeParams: true }); // Enable access to parent params

// Fetch all templates for the authenticated user
router.get("/", auth, TemplateController.getAllUserTemplates);
router.get("/:id", auth, TemplateController.getTemplateById);

router.post(
  "/",
  auth,
  validate(templateSchema),
  templateEntityCheck(),
  TemplateController.createTemplate
);

router.put(
  "/:id",
  auth,
  validate(templateUpdateSchema),
  TemplateController.updateTemplate
);

router.delete("/:id", auth, TemplateController.deleteTemplate);

module.exports = router;
