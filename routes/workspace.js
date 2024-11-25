const express = require("express");
const authMiddleware = require("../middlewares/auth");
const WorkspaceController = require("../controllers/workspace");
const validate = require("../middlewares/validate");
const workspaceSchema = require("../validations/workspace");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  // validate(workspaceSchema),
  WorkspaceController.createWorkspace
);
router.get("/", authMiddleware, WorkspaceController.getWorkspaceByUserId);
router.get("/:id", authMiddleware, WorkspaceController.getWorkspaceById);
router.put("/:id", authMiddleware, WorkspaceController.updateWorkspace);
router.delete("/:id", authMiddleware, WorkspaceController.deleteWorkspace);

module.exports = router;
