const WorkspaceServices = require("../services/workspace");

class WorkspaceController {
  //Create Workspace
  static async createWorkspace(req, res) {
    try {
      const {
        name,
        description,
        commerce,
        cms,
        payment,
        composer_url,
        crm,
        search,
      } = req.body;

      const workspace = await WorkspaceController.createWorkspace(
        {
          name,
          description,
          commerce,
          cms,
          crm,
          payment,
          search,
        },
        req.tempId,
        req.userId
      );

      return res.status(201).json({
        message: "Workspace created successfully",
        workspace: workspace,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating workspace", error: error.message });
    }
  }

  //Get workspace by ID
  static async getWorkspaceById(req, res) {
    try {
      const workspace = await WorkspaceServices.getWorkspaceByUserId(
        req.params.id,
        req.userId
      );

      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      return res.status(200).json(workspace);
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error fetching workspace data",
          error: error.message,
        });
    }
  }

  //Get all User's Workspaces
  static async getAllUserWorkspaces(req, res) {
    try {
      const workspaces = await WorkspaceServices.userAllWorkspaces(req.userId);

      if (!workspaces) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      return res.status(200).json(workspaces);
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error fetching workspace data",
          error: error.message,
        });
    }
  }

  //Update Workspace
  static async updateWorkspace(req, res) {
    try {
      const updates = req.body;
      const updatedWorkspace = await WorkspaceServices.updateWorkspace(
        updates,
        req.params.id,
        req.userId
      );

      if (!updatedWorkspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      res.status(200).json(updatedWorkspace);
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error updating workspace data",
          error: error.message,
        });
    }
  }

  //Delete Template
  static async deleteWorkspace(req, res) {
    try {
      const deletedWorkspace = await WorkspaceServices.deleteWorkspace(
        req.params.id,
        req.userId
      );
      if (!deletedWorkspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      res.status(200).json({ msg: "Workspace deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error deleting workspace data",
          error: error.message,
        });
    }
  }
}

module.exports = WorkspaceController;
