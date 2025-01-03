const Template = require("../models/template");

class TemplateService {
  //Get template by Id
  static async getTemplateById(id) {
    const template = await Template.findById(id);
    return template;
  }

  //Get template by Template Id and User Id
  static async getTemplateByUserId(template_id, user_id) {
    const template = await Template.findOne({
      _id: template_id,
      user_id: user_id,
    });
    return template;
  }

  //Get all templates of a User
  static async userTemplate(id) {
    const templates = await Template.find({ user_id: id });
    return templates;
  }

  //Create a Template
  static async createTemplate(payload) {
    const {
      name,
      description,
      bModel_id,
      type,
      commerce_id,
      cms_id,
      crm_id,
      payment_ids,
      search_id,
      user_id,
    } = payload;
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

    // Delete the template
    const deletedTemplate = await template.deleteOne();

    // delete Template Workspaces as well

    // Return the ID of the deleted template
    return deletedTemplate._id;
  }
}

module.exports = TemplateService;
