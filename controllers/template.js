const TemplateService = require("../services/template");

class TemplateController {
  //Create a Template
  static async createTemplate(req, res) {
    try {
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
      } = req.body;

      const template = await TemplateService.createTemplate({
        name,
        description,
        commerce_id,
        cms_id,
        payment_ids,
        crm_id,
        search_id,
        type,
        bModel_id,
        user_id: req.userId,
      });

      return res.status(201).json({
        message: "Template created successfully",
        template: template,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating template", error: error.message });
    }
  }

  //Get template by ID
  static async getTemplateById(req, res) {
    try {
      const template = await TemplateService.getTemplateByUserId(
        req.params.id,
        req.userId
      );

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      return res.status(200).json(template);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching template data",
        error: error.message,
      });
    }
  }

  //Get all User's Template
  static async getAllUserTemplates(req, res) {
    try {
      const templates = await TemplateService.userTemplate(req.userId);

      if (!templates) {
        return res.status(404).json({ message: "Template not found" });
      }

      const formattedRes = {
        templates: templates.map((template) => ({
          id: template.id,
          name: template.name,
          description: template.description,
          type: template.type,
        })),
      };

      return res.status(200).json(formattedRes);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching template data",
        error: error.message,
      });
    }
  }

  //Update Template
  static async updateTemplate(req, res) {
    try {
      const { template } = req.body;
      const updatedTemplate = await TemplateService.updateTemplate(
        template,
        req.params.id,
        req.userId
      );

      res
        .status(200)
        .json({ msg: "Template updated successfully", id: updatedTemplate });
    } catch (error) {
      if (error.message.includes("Template not found")) {
        return res.status(404).json({ message: "Template not found" });
      }
      if (error.message.includes("Can't Update Preset Template")) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: "Error updating template data",
        error: error.message,
      });
    }
  }

  //Delete Template
  static async deleteTemplate(req, res) {
    try {
      const deletedTemplate = await TemplateService.deleteTemplate(
        req.params.id,
        req.userId
      );
      if (!deletedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }

      res
        .status(200)
        .json({ msg: "Template deleted successfully", id: deletedTemplate });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting template data",
        error: error.message,
      });
    }
  }
}

module.exports = TemplateController;
