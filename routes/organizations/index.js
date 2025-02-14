const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const roleChecker = require("../../middlewares/roleCheckers");
const OrganizationController = require("../../controllers/organization");
const validate = require("../../middlewares/validate");
const orgUserRoutes = require("./user/index");
const templateRoutes = require("../template");
const workspaceRoutes = require("../workspace");

const {
  postOrganizationSchema,
} = require("../../validations/organization/index");

const router = express.Router({ mergeParams: true }); // Enable access to parent params
router.use(
  "/:organizationId/templates/:templateId/workspaces",
  authMiddleware,
  roleChecker.workspaceAdminCheck,
  workspaceRoutes
);

router.post(
  "/",
  authMiddleware,
  roleChecker.superAdminCheck,
  validate(postOrganizationSchema),
  OrganizationController.createOrganization
);

router.put(
  "/:id",
  authMiddleware,
  roleChecker.superAdminCheck,
  //validate(postOrganizationSchema),
  OrganizationController.updateOrganization
);

router.delete(
  "/:id",
  authMiddleware,
  roleChecker.superAdminCheck,
  OrganizationController.deleteOrganization
);

router.get(
  "/:id",
  authMiddleware,
  roleChecker.orgAdminCheck,
  OrganizationController.getAOrganization
);

router.get(
  "/",
  authMiddleware,
  roleChecker.orgAdminCheck,
  OrganizationController.getOrganizations
);

router.use(
  "/:organizationId/users",
  authMiddleware,
  roleChecker.orgAdminCheck,
  orgUserRoutes
);

router.use(
  "/:organizationId/templates",
  authMiddleware,
  roleChecker.templateAdminCheck,
  templateRoutes
);

module.exports = router;
