const Workspace = require("../models/workspace");
const Themes = require("../models/themes");
const TemplateService = require("./template");
const { formatCommerce } = require("../utils/dataFormatter/redis/commerce");
const RedisService = require("./redis"); // Import RedisService
const Organization = require("../models/organization");
//const { userTemplate } = require("./template"); //Avoid circular dependency

class WorkspaceServices {
  /**
   * Get Workspace by ID with caching
   * @param {String} id - Workspace ID
   */
  static async getWorkspaceById(id) {
    const cacheKey = `workspace:${id}:`;
    // Check if workspace is cached
    const cachedWorkspace = await RedisService.getCache(cacheKey);
    if (cachedWorkspace) {
      return cachedWorkspace; // Return cached data
    }

    // Fetch from database if not cached
    const workspace = await Workspace.findById(id);
    // if (workspace) {
    //   await RedisService.setCache(cacheKey, workspace); // Cache workspace
    // }
    return workspace;
  }

  /**
   * Get Workspace by ID and User ID with caching
   * @param {String} orgId - Organization ID
   * @param {String} template_id - Template ID
   * @param {Object} user - User
   */
  static async getWorkspacesByUserId(orgId, template_id, user) {
    try {
      const user_id = user._id;

      const org = await Organization.findById(orgId);
      if (!org) {
        throw new Error("Organization not found");
      }
      // Query all workspaces based on template_id and user_id
      const workspaces = await Workspace.find({
        template_id,
        orgId,
        users: { $in: [user_id] }, // Check if user_id exists in the users array
      }).select("_id name description");

      // Handle the case where no workspaces are found
      if (!workspaces || workspaces.length === 0) {
        throw new Error(
          `No workspaces found for template ID: ${template_id} and user ID: ${user_id}`
        );
      }

      // Map the workspaces to the desired formatted structure
      const formattedData = workspaces.map((workspace) => ({
        id: workspace._id,
        name: workspace.name,
        description: workspace.description,
      }));

      return formattedData;
    } catch (error) {
      //console.error("Error fetching workspaces by user ID:", error.message);
      throw new Error("Failed to fetch workspaces data --> " + error.message);
    }
  }

  /**
   * Get all Workspaces for a User
   * @param {String} user_id - User ID
   */
  static async getUsersAllWorkspaces(user_id) {
    const cacheKey = `user:${user_id}:workspaces`;
    const cachedWorkspaces = await RedisService.getCache(cacheKey);
    if (cachedWorkspaces) {
      return cachedWorkspaces;
    }

    const workspaces = await Workspace.find({ user_id });
    if (workspaces.length) {
      await RedisService.setCache(cacheKey, workspaces);
    }
    return workspaces;
  }

  /**
   * Create a new Workspace
   * @param {Object} payload - Workspace data
   * @param {String} template_id - Template ID
   * @param {String} user_id - User ID
   */
  static async createWorkspace(payload, template_id, user_id, orgId) {
    try {
      {
        const {
          name,
          description = "Streamline your operations with this all-in-one workspace.", // Default  description
          creds: { commerce, cms, crm, payment, search }, // Destructure credentials
          composer_url = "https://universalcomposer.com", // Default composer_url
          theme_id,
        } = payload;

        const org = await Organization.findById(orgId);
        if (!org) {
          throw new Error("Organization not found");
        }
        // Fetch template details  with circular dependency issue resolved
        const templateDetails = await (
          await require("./template")
        ).userTemplate(template_id, user_id);
        if (!templateDetails) {
          throw new Error("Template not found");
        }

        //Check theme and find that
        const themeDetails = await Themes.findById(theme_id);
        if (!themeDetails) {
          throw new Error("Theme not found");
        }
        // Construct workspace object
        const workspaceData = {
          name,
          description,
          commerce: {
            commerce_id: templateDetails.commerce_id,
            creds: commerce,
          },
          cms: {
            cms_id: templateDetails.cms_id,
            creds: cms,
          },
          payment: payment.map((cred, index) => ({
            payment_id:
              templateDetails.payment_ids[index] || `pay-${index + 1}`, // Handle dynamic payment IDs
            creds: cred,
          })), // Array of payment credentials
          search: {
            search_id: templateDetails.search_id,
            creds: search,
          },
          theme: {
            theme_id: themeDetails._id,
            name: themeDetails.name,
          },
          users: [user_id],
          template_id,
          orgId,
        };

        // Add optional CRM field if provided
        if (crm) {
          workspaceData.crm = {
            crm_id: templateDetails.crm_id,
            creds: crm,
          };
        }

        // Add composer_url if provided
        if (composer_url) {
          workspaceData.composer_url = composer_url;
        }

        //Ping to each server (Vendure,Strapi,Typesense)

        // Create and save the workspace
        const workspace = new Workspace(workspaceData);
        const newWorkspace = await workspace.save();

        // Cache the new workspace
        const formattedData = await formatCommerce(newWorkspace);

        await RedisService.setEnv(newWorkspace._id, formattedData);

        return newWorkspace._id;
      }
    } catch (error) {
      throw new Error(`Error creating workspace: ${error.message}`);
    }
  }

  /**
   * Update a Workspace
   * @param {Object} payload - Updated data
   * @param {String} template_id - Template ID
   * @param {String} workspace_id - Workspace ID
   * @param {String} user_id - User ID
   */
  static async updateWorkspace(payload, template_id, workspace_id, user_id) {
    try {
      // Fetch template details
      const templateDetails = await TemplateService.userTemplate(
        template_id,
        user_id
      );
      if (!templateDetails) {
        throw new Error("Template not found");
      }

      const {
        name,
        description,
        creds: { commerce, cms, crm, payment, search } = {}, // Destructure updated credentials
        composer_url,
      } = payload;

      // Fetch existing workspace details
      const existingWorkspace = await Workspace.findOne({
        _id: workspace_id,
        user_id,
      });

      if (!existingWorkspace) {
        throw new Error("Workspace not found");
      }

      // Update fields if provided
      if (name) {
        existingWorkspace.name = name;
        existingWorkspace.markModified("name");
      }

      if (description) {
        existingWorkspace.description = description;
        existingWorkspace.markModified("description");
      }

      if (commerce) {
        existingWorkspace.commerce.creds = commerce;
        existingWorkspace.markModified("commerce.creds");
      }

      if (cms) {
        existingWorkspace.cms.creds = cms;
        existingWorkspace.markModified("cms.creds");
      }

      if (payment) {
        existingWorkspace.payment = payment.map((cred, index) => ({
          payment_id:
            existingWorkspace.payment[index]?.payment_id || `pay-${index + 1}`, // Handle dynamic payment IDs
          creds: cred,
        }));
        existingWorkspace.markModified("payment");
      }

      if (search) {
        existingWorkspace.search.creds = search;
        existingWorkspace.markModified("search.creds");
      }

      if (composer_url) {
        existingWorkspace.composer_url = composer_url;
        existingWorkspace.markModified("composer_url");
      }

      if (crm) {
        if (!existingWorkspace.crm) {
          existingWorkspace.crm = {}; // Initialize if not present
        }
        existingWorkspace.crm.creds = crm;
        existingWorkspace.markModified("crm.creds");
      }

      // Save the updated workspace
      const updatedWorkspace = await existingWorkspace.save();

      // Update cache with the new workspace data
      const formattedData = await formatCommerce(updatedWorkspace);

      await RedisService.setEnv(updatedWorkspace._id, formattedData);

      return updatedWorkspace._id;
    } catch (error) {
      throw new Error(`Error updating workspace: ${error.message}`);
    }
  }

  /**
   * Delete a Workspace
   * @param {String} template_id - Template ID
   * @param {String} workspace_id - Workspace ID
   * @param {String} user_id - User ID
   */
  static async deleteWorkspace(template_id, workspace_id, user_id) {
    const deletedWorkspace = await Workspace.findOneAndDelete({
      _id: workspace_id,
      users: user_id, // Matches if user_id is in the users array
      template_id,
    });

    if (deletedWorkspace) {
      const cacheKey = `workspace:${workspace_id}:env`;
      await RedisService.clearCache(cacheKey); // Clear env for deleted workspace
    }

    return deletedWorkspace?._id;
  }

  /**
   * Set environment data for a Workspace
   * @param {String} workspace_id - Workspace ID
   * @param {Object} envData - Environment data to store
   */
  static async setWorkspaceEnv(workspace_id, envData) {
    await RedisService.setEnv(workspace_id, envData);
  }

  /**
   * Get environment data for a Workspace
   * @param {String} workspace_id - Workspace ID
   * @returns {Object|null} Environment data
   */
  static async getWorkspaceEnv(workspace_id) {
    return await RedisService.getEnv(workspace_id);
  }

  /**
   * Get metrics data for a Workspace
   * @param {String} template_id - Template ID
   * @param {String} workspace_id - Workspace ID
   * @param {String} user_id - User ID
   * @returns {Object|null} Environment data
   */

  static async getWorkspaceMetrics(template_id, workspace_id, user_id) {
    const sample = {
      id: workspace_id,
      template_id: template_id,
      name: "Sample",
      counts: { orders: 4, customers: 5, revenue: 1000, profit: 500 },
    };

    return sample;
  }

  /**
   * Delete bulk workspaces by template ID and user ID
   * @param {String} template_id - The ID of the template
   * @param {String} user_id - The ID of the user
   * @returns {Object} - Deletion summary
   */
  static async deleteBulkWorkspaces(template_id, user_id) {
    try {
      // Find all workspaces matching the template ID and user ID
      const workspaces = await Workspace.find({ template_id, user_id });

      if (workspaces.length === 0) {
        return {
          message: "No workspaces found for the given template and user.",
          deletedWorkspaces: [],
        };
      }

      // Remove the workspaces one by one and clear cache
      const workspaceIds = workspaces.map((workspace) => workspace._id);

      for (const workspaceId of workspaceIds) {
        // Delete from database
        await Workspace.findByIdAndDelete(workspaceId);

        // Clear cache
        const cacheKey = `workspace:${workspaceId}`;
        await RedisService.clearCache(cacheKey);
      }

      return {
        message: `${workspaceIds.length} workspace(s) deleted successfully.`,
        deletedWorkspaces: workspaceIds,
      };
    } catch (error) {
      console.error("Error deleting bulk workspaces:", error);
      throw new Error("Failed to delete bulk workspaces.");
    }
  }

  static async addUserToWorkspace(userId, workspaceId) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found for ID: ${workspaceId}`);
    }
    //push the user to the Workspace's users array
    workspace.users.push(userId);
    await workspace.save();
    return workspace._id;
  }
}

module.exports = WorkspaceServices;
