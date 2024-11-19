const Workspace = require("../models/workspace");
const TemplateService = require("./template");

class WorkspaceServices {
  //Get Workspace by Id
  static async getWorkspaceById(id) {
    const workspace = await Workspace.findById(id);
    return workspace;
  }

  //Get Workspace by Id and User Id
  static async getWorkspaceByUserId(workspace_id, user_id) {
    const workspace = await Workspace.findOne({
      _id: workspace_id,
      user_id: user_id,
    });
    return workspace;
  }

  //User all Workspaces
  static async getUsersAllWorkspaces(user_id) {
    const workspace = await Workspace.find({ user_id: req.userId });
    return workspace;
  }

  //Create a Workspace
  static async createWorkspace(payload, template_id, user_id) {
    const { name, description, commerce, cms, crm, payment, search } = payload;
    const tempateDetails = TemplateService.getTemplateByUserId(
      template_id,
      user_id
    );
    if (!tempateDetails) {
      return;
    }

    const workspace = new Workspace({
      name,
      description,
      commerce: {
        commerce_id: tempateDetails.commerce_id,
        creds: commerce,
      },
      cms: {
        cms_id: tempateDetails.cms_id,
        creds: cms,
      },
      payment: {
        payment_id: tempateDetails.payment_id,
        creds: payment,
      },
      crm: {
        crm_id: tempateDetails.crm_id,
        creds: crm,
      },
      search: {
        search_id: tempateDetails.search_id,
        creds: search,
      },
      composer_url,
      user_id: user_id,
      template_id: template_id,
    });

    const newWorkspace = workspace.save();
    return newWorkspace;
  }

  //Update Workspace
  static async updateWorkspace(payload, workspace_id, user_id) {
    const updates = payload;

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      { _id: workspace_id, user_id: user_id },
      update,
      { new: true, runValidators: true }
    );
    return updatedWorkspace;
  }

  //Delete Workspace
  static async deleteWorkspace(id) {
    const deletedUser = await User.findByIdAndDelete({
      _id: workspace_id,
      user_id: user_id,
    });
    return deletedUser;
  }
}

module.exports = WorkspaceServices;
