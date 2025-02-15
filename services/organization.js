const Organization = require("../models/organization");
const UserService = require("./user");

class OrganizationService {
  static async getAllOrganizations(userId) {
    try {
      const organizations = await Organization.find({
        users: { $in: [userId] },
      }).lean();
      if (organizations.length === 0) {
        throw new Error(`No organizations found for user ${userId}`);
      }
      //return only id name and description
      return organizations.map((org) => ({
        id: org._id,
        name: org.name,
        description: org.description || "",
        users: org.users.length,
        createdAt: org.createdAt,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch organizations for user ${userId}: ${error.message}`
      );
    }
  }

  static async getOrganization(userId, organizationId) {
    try {
      const organization = await Organization.findOne({
        _id: organizationId,
        users: { $in: [userId] },
      }).lean();
      if (!organization) {
        throw new Error(`Organization not found`);
      }
      const users = await (
        await require("../services/user")
      ).getbulkUsers(organization.users);
      const formattedRes = {
        id: organization._id,
        name: organization.name,
        description: organization.description || "",
        isActive: organization.is_active,
        users,
      };
      return formattedRes;
    } catch (error) {
      throw new Error(
        `Failed to fetch organization ${organizationId}: ${error.message}`
      );
    }
  }

  static async createOrganization(
    userId,
    { name, description, isActive = true }
  ) {
    try {
      const organization = await Organization.create({
        name,
        description,
        is_active: isActive,
        created_by: userId,
        users: [userId],
      });
      return organization._id;
    } catch (error) {
      throw new Error("Organization not created :" + error.message);
    }
  }

  static async updateOrganization(
    userId,
    organizationId,
    { name, description }
  ) {
    try {
      await this.getOrganization(userId, organizationId);
      const allowedUpdates = ["name", "description"];
      // use the allowedUpdates array to filter out any keys that are not allowed
      const updates = Object.fromEntries(
        Object.entries({ name, description }).filter(([key, value]) =>
          allowedUpdates.includes(key)
        )
      );

      await Organization.updateOne({ _id: organizationId }, updates);

      return organizationId;
    } catch (error) {
      throw new Error(
        `Failed to update organization ${organizationId}: ${error.message}`
      );
    }
  }

  static async deleteOrganization(userId, organizationId) {
    try {
      await this.getOrganization(userId, organizationId);

      await Organization.deleteOne({ _id: organizationId });
      return true;
    } catch (error) {
      throw new Error(
        `Failed to delete organization ${organizationId}: ${error.message}`
      );
    }
  }

  static async addUserToOrganization(organizationId, userId) {
    try {
      const organization = await Organization.findOne({ _id: organizationId });
      if (!organization) {
        throw new Error(`Organization not found`);
      }
      organization.users.push(userId);
      await organization.save();
      return true;
    } catch (error) {
      throw new Error(
        `Failed to add user ${userId} to organization ${organizationId}: ${error.message}`
      );
    }
  }
}

module.exports = OrganizationService;
