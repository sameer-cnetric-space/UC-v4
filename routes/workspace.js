const express = require("express");
const authMiddleware = require("../middlewares/auth");
const WorkspaceController = require("../controllers/workspace");
const validate = require("../middlewares/validate");
const workspaceSchema = require("../validations/workspace");
const commerceRoutes = require("./commerce/admin/index");
const roleChecker = require("../middlewares/roleCheckers");

const router = express.Router({ mergeParams: true }); // Enable access to parent params

router.post(
  "/",
  // authMiddleware,
  // validate(workspaceSchema),
  roleChecker.templateAdminCheck,
  WorkspaceController.createWorkspace
);
router.get(
  "/",
  roleChecker.templateAdminCheck,
  WorkspaceController.getWorkspaceByUserId
);
router.get("/:workspace_id", WorkspaceController.getWorkspaceById);
router.get("/:workspace_id/metrics", WorkspaceController.getWorkspaceMetrics);
router.put(
  "/:workspace_id",
  roleChecker.templateAdminCheck,
  WorkspaceController.updateWorkspace
);
router.delete(
  "/:workspace_id",
  roleChecker.templateAdminCheck,
  WorkspaceController.deleteWorkspace
);

/*
Commerce Routes
*/
router.use("/:workspace_id/commerce", commerceRoutes);

module.exports = router;
