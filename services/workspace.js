// const Workspace = require("../models/workspace");
// const TemplateService = require("./template");

// class WorkspaceServices {
//   //Get Workspace by Id
//   static async getWorkspaceById(id) {
//     const workspace = await Workspace.findById(id);
//     return workspace;
//   }

//   //Get Workspace by Id and User Id
//   static async getWorkspaceByUserId(workspace_id, user_id) {
//     const workspace = await Workspace.findOne({
//       _id: workspace_id,
//       user_id: user_id,
//     });
//     return workspace;
//   }

//   //User all Workspaces
//   static async getUsersAllWorkspaces(user_id) {
//     const workspace = await Workspace.find({ user_id: req.userId });
//     return workspace;
//   }

//   //Create a Workspace
//   static async createWorkspace(payload, template_id, user_id) {
//     const { name, description, commerce, cms, crm, payment, search } = payload;
//     const tempateDetails = TemplateService.getTemplateByUserId(
//       template_id,
//       user_id
//     );
//     if (!tempateDetails) {
//       return;
//     }

//     const workspace = new Workspace({
//       name,
//       description,
//       commerce: {
//         commerce_id: tempateDetails.commerce_id,
//         creds: commerce,
//       },
//       cms: {
//         cms_id: tempateDetails.cms_id,
//         creds: cms,
//       },
//       payment: {
//         payment_id: tempateDetails.payment_id,
//         creds: payment,
//       },
//       crm: {
//         crm_id: tempateDetails.crm_id,
//         creds: crm,
//       },
//       search: {
//         search_id: tempateDetails.search_id,
//         creds: search,
//       },
//       composer_url,
//       user_id: user_id,
//       template_id: template_id,
//     });

//     const newWorkspace = workspace.save();
//     return newWorkspace;
//   }

//   //Update Workspace
//   static async updateWorkspace(payload, workspace_id, user_id) {
//     const updates = payload;

//     const updatedWorkspace = await Workspace.findByIdAndUpdate(
//       { _id: workspace_id, user_id: user_id },
//       update,
//       { new: true, runValidators: true }
//     );
//     return updatedWorkspace;
//   }

//   //Delete Workspace
//   static async deleteWorkspace(id) {
//     const deletedUser = await User.findByIdAndDelete({
//       _id: workspace_id,
//       user_id: user_id,
//     });
//     return deletedUser;
//   }
// }

// module.exports = WorkspaceServices;

const Workspace = require("../models/workspace");
const TemplateService = require("./template");
const { formatCommerce } = require("../utils/dataFormatter/redis/commerce");
const RedisService = require("./redis"); // Import RedisService

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
   * @param {String} template_id - Template ID
   * @param {String} user_id - User ID
   */
  static async getWorkspacesByUserId(template_id, user_id) {
    try {
      // Query all workspaces based on template_id and user_id
      const workspaces = await Workspace.find({
        template_id,
        user_id,
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
      console.error("Error fetching workspaces by user ID:", error.message);
      throw new Error("Failed to fetch workspaces data.");
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
  static async createWorkspace(payload, template_id, user_id) {
    try {
      {
        const {
          name,
          description = "Streamline your operations with this all-in-one workspace.", // Default  description
          creds: { commerce, cms, crm, payment, search }, // Destructure credentials
          composer_url = "https://universalcomposer.com", // Default composer_url
        } = payload;

        // Fetch template details
        const templateDetails = await TemplateService.getTemplateByUserId(
          template_id,
          user_id
        );
        if (!templateDetails) {
          throw new Error("Template not found");
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
          user_id,
          template_id,
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
   * @param {String} workspace_id - Workspace ID
   * @param {String} user_id - User ID
   */
  static async updateWorkspace(payload, workspace_id, user_id) {
    const updatedWorkspace = await Workspace.findOneAndUpdate(
      { _id: workspace_id, user_id },
      payload,
      { new: true, runValidators: true }
    );

    if (updatedWorkspace) {
      const cacheKey = `workspace:${workspace_id}`;
      await RedisService.setCache(cacheKey, updatedWorkspace); // Update cache
    }

    return updatedWorkspace;
  }

  /**
   * Delete a Workspace
   * @param {String} template_id - Template ID
   * @param {String} workspace_id - Workspace ID
   * @param {String} user_id - User ID
   */
  static async deleteWorkspace(template_id, workspace_id, user_id) {
    console.log(template_id);
    console.log(workspace_id);
    console.log(user_id);
    const deletedWorkspace = await Workspace.findOneAndDelete({
      _id: workspace_id,
      user_id,
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
}

module.exports = WorkspaceServices;
