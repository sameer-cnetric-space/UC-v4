const Template = require("../models/template");
const TemplateHandler = require("../handlers/template");
const WorkspaceServices = require("./workspace");

class TemplateService {
  //Get template by Id
  static async getTemplateById(req, id) {
    const template = await Template.findById(id);
    if (!template) {
      throw new Error("Template not found");
    }

    return await TemplateHandler.formatTemplateData(req, template);
  }

  // Get templates by Template ID and User ID, grouped by type
  static async getTemplatesByUserId(req, user_id) {
    // Query for preset templates
    const presets = await Template.find({ type: { $ne: "Custom" } }) // Fetches all except "Custom"
      .select("-__v")
      .lean(); // Optimizes performance by returning plain objects

    // Query for custom templates
    const custom = await Template.find({
      user_id: user_id,
      type: "Custom",
    })
      .select("-__v")
      .lean(); // Optimizes performance by returning plain objects;

    // Return an object containing both arrays
    return await TemplateHandler.formatTemplateDataList(req, presets, custom);
  }

  //Get all templates of a User
  static async userTemplate(template_id, user_id) {
    // First, try to find a preset template by ID
    let template = await Template.findOne({ _id: template_id, type: "Preset" });
    // If no preset template is found, look for a custom template with user_id
    if (!template) {
      template = await Template.findOne({
        _id: template_id,
        user_id,
        type: "Custom",
      });
    }
    return template;
  }

  //Create a Template
  static async createTemplate(payload) {
    const {
      name,
      description,
      bModel_id,
      commerce_id,
      cms_id,
      crm_id,
      payment_ids,
      search_id,
      user_id,
    } = payload;
    const type = "Custom";
    const template = new Template({
      name,
      description,
      commerce_id,
      cms_id,
      payment_ids,
      crm_id,
      search_id,
      type,
      bModel_id,
      user_id,
    });
    const newTemplate = await template.save();
    const formattedRes = {
      id: newTemplate._id,
      name: newTemplate.name,
      type: newTemplate.type,
    };

    return formattedRes;
  }

  // Update Template
  static async updateTemplate(payload, template_id, user_id) {
    // Fetch the template document by ID and user ID
    const template = await Template.findOne({
      _id: template_id,
      user_id,
    });

    if (!template) {
      throw new Error(`Template not found for ID: ${template_id}`);
    }
    if (template.type.toLowerCase() === "preset") {
      throw new Error(`Can't Update Preset Template `);
    }

    // Allow updates only to name and description
    if (payload.name !== undefined) {
      template.name = payload.name;
    }
    if (payload.description !== undefined) {
      template.description = payload.description;
    }

    // Save the updated template
    const updatedTemplate = await template.save();

    return updatedTemplate._id;
  }

  // Delete Template
  static async deleteTemplate(template_id, user_id) {
    // Fetch the template by ID and user ID
    const template = await Template.findOne({
      _id: template_id,
      user_id: user_id,
    });

    // Check if the template exists
    if (!template) {
      throw new Error(`Template not found for ID: ${template_id}`);
    }

    // Check if the template is a preset type
    if (template.type && template.type.toLowerCase() === "preset") {
      throw new Error(`Can't delete a preset template.`);
    }

    // delete Template Workspaces as well
    const deleteBulk = await WorkspaceServices.deleteBulkWorkspaces(
      template_id,
      user_id
    );

    // Delete the template
    const deletedTemplate = await template.deleteOne();

    // Return the ID of the deleted template
    return {
      message: "Template deleted successfully",
      id: deletedTemplate._id,
      workspaces: deleteBulk,
    };
  }
}

module.exports = TemplateService;
