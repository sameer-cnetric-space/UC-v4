const Organization = require("../models/organization");
const UserService = require("./user");

class OrganizationService {
  static async getAllOrganizations(userId, path = "") {
    try {
      const organizations = await Organization.find(
        { users: userId },
        { _id: 1, name: 1, description: 1, users: 1, createdAt: 1 }
      ).sort({ createdAt: -1 });

      if (!organizations.length) {
        if (path !== "/me")
          throw new Error(`No organizations found for user ${userId}`);
        return [];
      }

      return organizations.map(
        ({ _id, name, description, users, createdAt }) => ({
          id: _id,
          name,
          description: description || "",
          users: users.length,
          createdAt,
        })
      );
    } catch (error) {
      throw new Error(`Error fetching organizations: ${error.message}`);
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

      //order by super-admin > org-admin > template-admin > workspace-admin
      // Define role hierarchy for sorting
      const roleHierarchy = {
        "super-admin": 1,
        "org-admin": 2,
        "template-admin": 3,
        "workspace-admin": 4,
      };

      // Sort users based on role priority (ascending order)
      const sortedUsers = users.sort((a, b) => {
        return (roleHierarchy[a.role] || 999) - (roleHierarchy[b.role] || 999);
      });

      const formattedRes = {
        id: organization._id,
        name: organization.name,
        description: organization.description || "",
        isActive: organization.is_active,
        users: sortedUsers,
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

  static async addUserToOrganization(organizationId, userId, session = null) {
    try {
      // ✅ Find organization inside transaction
      const organization = await Organization.findOne({
        _id: organizationId,
      }).session(session);

      if (!organization) {
        throw new Error(`Organization not found`);
      }

      // ✅ Push user to organization
      organization.users.push(userId);

      // ✅ Save organization inside transaction
      await organization.save({ session });

      return true;
    } catch (error) {
      throw new Error(
        `Failed to add user ${userId} to organization ${organizationId}: ${error.message}`
      );
    }
  }
}

module.exports = OrganizationService;
