const express = require("express");
const authMiddleware = require("../middlewares/auth");
const WorkspaceController = require("../controllers/workspace");
const validate = require("../middlewares/validate");
const workspaceSchema = require("../validations/workspace");

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

module.exports = router;
