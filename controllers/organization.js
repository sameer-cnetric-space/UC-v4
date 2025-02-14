const OrganizationService = require("../services/organization");
class OrganizationController {
  static async getOrganizations(req, res) {
    try {
      const userId = req.user._id;
      const organizations = await OrganizationService.getAllOrganizations(
        userId
      );
      return res.status(200).json({ organizations });
    } catch (error) {
      if (error.message.includes("No organizations found")) {
        return res.status(404).json({ message: "No organizations found" });
      }
      return res
        .status(500)
        .json({ message: "Error getting organizations", error: error.message });
    }
  }

  static async getAOrganization(req, res) {
    try {
      const userId = req.user._id;
      const organizationId = req.params.id;
      const organization = await OrganizationService.getOrganization(
        userId,
        organizationId
      );
      return res.status(200).json({ organization });
    } catch (error) {
      if (error.message.includes("Organization not found")) {
        return res.status(404).json({ message: "Organization not found" });
      }
      return res
        .status(500)
        .json({ message: "Error getting organization", error: error.message });
    }
  }

  static async createOrganization(req, res) {
    try {
      const userId = req.user._id;
      const { name, description } = req.body;
      const organization = await OrganizationService.createOrganization(
        userId,
        { name, description }
      );
      return res.status(201).json({
        message: "Organization created successfully",
        id: organization,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating organization", error: error.message });
    }
  }

  static async updateOrganization(req, res) {
    try {
      const userId = req.user._id;
      const organizationId = req.params.id;
      const { name, description } = req.body;
      const organization = await OrganizationService.updateOrganization(
        userId,
        organizationId,
        { name, description }
      );
      return res.status(200).json({
        message: "Organization updated successfully",
        id: organization,
      });
    } catch (error) {
      if (error.message.includes("Organization not found")) {
        return res.status(404).json({ message: "Organization not found" });
      }
      return res
        .status(500)
        .json({ message: "Error updating organization", error: error.message });
    }
  }

  static async deleteOrganization(req, res) {
    try {
      const userId = req.user._id;
      const organizationId = req.params.id;
      await OrganizationService.deleteOrganization(userId, organizationId);
      return res.status(200).json({ message: "Organization deleted" });
    } catch (error) {
      if (error.message.includes("Organization not found")) {
        return res.status(404).json({ message: "Organization not found" });
      }
      return res
        .status(500)
        .json({ message: "Error deleting organization", error: error.message });
    }
  }
}

module.exports = OrganizationController;
