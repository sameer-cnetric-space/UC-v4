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
      payment_id,
      search_id,
      user_id,
    } = payload;
    const template = new Template({
      name,
      description,
      commerce_id,
      cms_id,
      payment_id,
      crm_id,
      search_id,
      type,
      bModel_id,
      user_id,
    });
    const newTemplate = await template.save();
    return newTemplate;
  }

  //Update Template
  static async updateTemplate(payload, template_id, user_id) {
    const update = payload;

    const updatedTemplate = await Template.findByIdAndUpdate(
      { _id: template_id, user_id: user_id },
      update,
      { new: true, runValidators: true }
    );
    return updatedTemplate;
  }

  //Delete Template
  static async deleteTemplate(template_id, user_id) {
    const deletedTemplate = await Template.findByIdAndDelete({
      _id: template_id,
      user_id: user_id,
    });
    return deletedTemplate;
  }
}

module.exports = TemplateService;
