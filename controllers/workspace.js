const WorkspaceServices = require("../services/workspace");

class WorkspaceController {
  /**
   * Get Workspace by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getWorkspaceById(req, res) {
    try {
      const { id, workspace_id } = req.params;
      const workspace = await WorkspaceServices.getWorkspaceById(workspace_id);

      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      return res.status(200).json({
        data: workspace,
      });
    } catch (error) {
      console.error("Error in getWorkspaceById:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch workspace",
        error: error.message,
      });
    }
  }

  /**
   * Get Workspace by ID and User ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getWorkspaceByUserId(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId; // Assuming userId is extracted from the token

      const workspaces = await WorkspaceServices.getWorkspacesByUserId(
        id, // template_id
        user_id
      );

      if (!workspaces) {
        return res
          .status(404)
          .json({ message: "Workspaces not found for this user" });
      }

      return res.status(200).json({
        workspaces,
      });
    } catch (error) {
      console.error("Error in getWorkspaceByUserId:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch workspace for user",
        error: error.message,
      });
    }
  }

  /**
   * Get all Workspaces for a User
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getUsersAllWorkspaces(req, res) {
    try {
      const user_id = req.userId; // Assuming userId is extracted from the token

      const workspaces = await WorkspaceServices.getUsersAllWorkspaces(user_id);

      return res.status(200).json({
        status: "success",
        data: workspaces,
      });
    } catch (error) {
      console.error("Error in getUsersAllWorkspaces:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch user's workspaces",
        error: error.message,
      });
    }
  }

  /**
   * Create a Workspace
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createWorkspace(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId; // Assuming userId is extracted from the token

      // Call the service to create the workspace
      const workspace = await WorkspaceServices.createWorkspace(
        req.body,
        id,
        user_id
      );

      return res.status(201).json({
        message: "Workspace created successfully",
        id: workspace,
      });
    } catch (error) {
      console.error("Error in createWorkspace:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to create workspace",
        error: error.message,
      });
    }
  }

  /**
   * Update a Workspace
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateWorkspace(req, res) {
    try {
      const { id: workspace_id } = req.params;
      const user_id = req.userId; // Assuming userId is extracted from the token

      const updatedWorkspace = await WorkspaceServices.updateWorkspace(
        req.body,
        workspace_id,
        user_id
      );

      if (!updatedWorkspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      return res.status(200).json({
        status: "success",
        message: "Workspace updated successfully",
        data: updatedWorkspace,
      });
    } catch (error) {
      console.error("Error in updateWorkspace:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to update workspace",
        error: error.message,
      });
    }
  }

  /**
   * Delete a Workspace
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteWorkspace(req, res) {
    try {
      const { id, workspace_id } = req.params;
      const user_id = req.userId; // Assuming userId is extracted from the token

      const deletedWorkspace = await WorkspaceServices.deleteWorkspace(
        id,
        workspace_id,
        user_id
      );

      if (!deletedWorkspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      return res.status(200).json({
        message: "Workspace deleted successfully",
        id: deletedWorkspace,
      });
    } catch (error) {
      console.error("Error in deleteWorkspace:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to delete workspace",
        error: error.message,
      });
    }
  }

  /**
   * Get a Workspace Metrics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */

  static async getWorkspaceMetrics(req, res) {
    try {
      const { id, workspace_id } = req.params;
      const user_id = req.userId; // Assuming userId is extracted from the token
      const metrics = await WorkspaceServices.getWorkspaceMetrics(
        id,
        workspace_id,
        user_id
      );
      return res.status(200).json({ metrics });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to get workspace metrics",
        error: error.message,
      });
    }
  }
}

module.exports = WorkspaceController;
