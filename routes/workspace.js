const express = require("express");
const authMiddleware = require("../middlewares/auth");
const WorkspaceController = require("../controllers/workspace");
const validate = require("../middlewares/validate");
const workspaceSchema = require("../validations/workspace");
const commerceRoutes = require("./commerce/admin/index");

const router = express.Router({ mergeParams: true }); // Enable access to parent params

router.post(
  "/",
  authMiddleware,
  // validate(workspaceSchema),
  WorkspaceController.createWorkspace
);
router.get("/", authMiddleware, WorkspaceController.getWorkspaceByUserId);
router.get(
  "/:workspace_id",
  authMiddleware,
  WorkspaceController.getWorkspaceById
);
router.get(
  "/:workspace_id/metrics",
  authMiddleware,
  WorkspaceController.getWorkspaceMetrics
);
router.put(
  "/:workspace_id",
  authMiddleware,
  WorkspaceController.updateWorkspace
);
router.delete(
  "/:workspace_id",
  authMiddleware,
  WorkspaceController.deleteWorkspace
);

/*
Commerce Routes
*/
router.use("/:workspace_id/commerce", commerceRoutes);

module.exports = router;
