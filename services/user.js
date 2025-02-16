const AuthService = require("./auth");
const User = require("../models/user");
const { buildFileUrl } = require("../utils/buildUrl");
const OrganizationService = require("./organization");
const TemplateService = require("./template");
const WorkspaceService = require("./workspace");
const mongoose = require("mongoose");

class UserService {
  // Get User from ID
  static async getUserById(req, id) {
    const user = await User.findById(id).select("-password -salt -__v");
    if (!user) throw new Error("User not found");

    user.profile_picture = buildFileUrl(req, user.profile_picture);

    return user;
  }

  static async getUserByIdNoImgUrl(id) {
    const user = await User.findById(id).select("-password -salt -__v");
    if (!user) throw new Error("User not found");

    return user;
  }

  // Get User by Username
  static async getUserByUsername(username) {
    const user = await User.findOne({ username }).select("-password -salt");
    if (!user) throw new Error("User not found");
    return user;
  }

  // Get user by email or username
  static getUserByEmailOrUsername(login) {
    // Check if login is an email (simple regex to check '@' character)
    if (login.includes("@")) {
      return User.findOne({ email: login });
    } else {
      return User.findOne({ username: login });
    }
  }

  // Create New User
  static async createUser(payload) {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      phone_number,
      role,
      is_active,
      profile_picture,
    } = payload;

    // Generate salt and hash the password
    const salt = AuthService.generateSalt();
    const hashedPassword = AuthService.generateHash(salt, password);

    const user = new User({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      phone_number,
      profile_picture:
        profile_picture || "/public/assets/entities/user/defUser.jpg",
      is_active: is_active !== undefined ? is_active : true,
      salt,
      role,
    });

    const newUser = await user.save();
    const tokenExpiry = process.env.JWT_EXPIRES_IN_USER || "7h";
    const token = AuthService.generateToken(newUser, tokenExpiry);

    return {
      user: {
        id: newUser._id,
        username: newUser.username,
      },
      token,
    };
  }

  // Get User Token
  static async getUserToken(payload) {
    const { login, password } = payload; // `login` can be email or username
    const user = await UserService.getUserByEmailOrUsername(login).select(
      "+password +salt"
    );

    if (!user) throw new Error("User not found");

    if (!user.is_active)
      throw new Error("User is not active, Please contact your admin.");

    const isValidPassword = AuthService.validatePassword(password, user);
    if (!isValidPassword) throw new Error("Invalid credentials");
    const tokenExpiry = process.env.JWT_EXPIRES_IN_USER || "7h";

    return AuthService.generateToken(user, tokenExpiry);
  }

  // // Update User
  // static async updateUser(payload, id) {
  //   const update = { ...payload };

  //   // Hash password if being updated
  //   if (update.password) {
  //     const salt = AuthService.generateSalt();
  //     update.salt = salt;
  //     update.password = AuthService.generateHash(salt, update.password);
  //   }

  //   const updatedUser = await User.findByIdAndUpdate(id, update, {
  //     new: true,
  //     runValidators: true,
  //   }).select("-password -salt");

  //   if (!updatedUser) throw new Error("User not found");
  //   return updatedUser;
  // }

  // // Delete User
  // static async deleteUser(id) {
  //   const deletedUser = await User.findByIdAndDelete(id);
  //   if (!deletedUser) throw new Error("User not found");
  //   return deletedUser;
  // }

  static async getbulkUsers(ids) {
    const users = await User.find({
      _id: { $in: ids },
    })
      .select("_id first_name last_name email role is_active")
      .lean();
    if (users.length === 0) {
      throw new Error(`No users found`);
    }
    const formattedRes = users.map((user) => ({
      id: user._id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
    }));
    return formattedRes;
  }

  // static async addUserToOrganization(
  //   organizationId,
  //   currentUserRole,
  //   {
  //     first_name,
  //     last_name = "",
  //     username,
  //     email,
  //     password,
  //     phone_number,
  //     profile_picture = "",
  //     is_active = true,
  //     role,
  //   },
  //   entity = {}
  // ) {
  //   if (currentUserRole !== "super-admin" && role === "org-admin") {
  //     throw new Error("Only super admins can add organization admins");
  //   }
  //   const user = await this.createUser({
  //     first_name,
  //     last_name,
  //     username,
  //     email,
  //     password,
  //     phone_number,
  //     profile_picture,
  //     is_active,
  //     role,
  //   });
  //   // attach this user to the organization
  //   const result = await OrganizationService.addUserToOrganization(
  //     organizationId,
  //     user.user.id
  //   );

  //   if (!result) {
  //     throw new Error("Failed to add user to organization");
  //   }

  //   if (entity) {
  //     entity.org_id = organizationId;
  //     switch (entity.type) {
  //       // case "template":
  //       //   await TemplateService.addUserToTemplate(user.user.id, entity.id);
  //       //   break;

  //       case "workspace":
  //         const access = entity;
  //         await WorkspaceService.addUserToWorkspace(
  //           user.user.id,
  //           entity.workspace_id
  //         );

  //         await User.findByIdAndUpdate(
  //           user.user.id,
  //           { $set: { access: access } },
  //           { new: true }
  //         );
  //         break;
  //       default:
  //         throw new Error("Invalid entity type");
  //     }
  //   }
  //   return user.user;
  // }

  static async addUserToOrganization(
    organizationId,
    currentUserRole,
    {
      first_name,
      last_name = "",
      username,
      email,
      password,
      phone_number,
      profile_picture = "",
      is_active = true,
      role,
    },
    entity = {}
  ) {
    const session = await mongoose.startSession();
    session.startTransaction(); // ✅ Start Transaction

    try {
      // ✅ Prevent unauthorized users from adding org-admins
      if (currentUserRole !== "super-admin" && role === "org-admin") {
        throw new Error("Only super admins can add organization admins.");
      }

      // ✅ Validate the organization before proceeding
      // const isOrgValid = await OrganizationService.validateOrganization(
      //   organizationId
      // );
      // if (!isOrgValid) {
      //   throw new Error("Invalid or non-existent organization.");
      // }

      // ✅ Create the user inside the transaction
      const user = await this.createUser(
        {
          first_name,
          last_name,
          username,
          email,
          password,
          phone_number,
          profile_picture,
          is_active,
          role,
        },
        { session } // ✅ Ensure user creation is inside the transaction
      );

      // ✅ Attach user to the organization (inside the transaction)
      const attachResult = await OrganizationService.addUserToOrganization(
        organizationId,
        user.user.id,
        session
      );

      if (!attachResult) {
        throw new Error("Failed to attach user to organization.");
      }

      // ✅ Handle entity assignment (Workspaces, Templates, etc.)
      if (entity && entity.type) {
        entity.org_id = organizationId;

        switch (entity.type) {
          case "workspace":
            const access = entity;

            // Run these in parallel using `Promise.all`
            await Promise.all([
              WorkspaceService.addUserToWorkspace(
                user.user.id,
                entity.workspace_id,
                session
              ),
              User.findByIdAndUpdate(
                user.user.id,
                { $set: { access: access } },
                { new: true, session }
              ),
            ]);
            break;

          default:
            throw new Error("Invalid entity type.");
        }
      }

      // ✅ Commit the transaction if everything succeeds
      await session.commitTransaction();
      session.endSession();

      return user.user;
    } catch (error) {
      console.error("Error in addUserToOrganization:", error.message);

      // 🚨 Rollback: Abort the transaction
      await session.abortTransaction();
      session.endSession();

      // ✅ Delete user manually if it was created but the transaction failed
      await User.deleteOne({ email });

      console.log("Transaction rolled back. User creation reverted.");
      throw new Error(error.message || "Failed to add user to organization.");
    }
  }

  // static async deleteUserFromOrganization(orgId, userId) {
  //   await OrganizationService.deleteUserFromOrganization(orgId, userId);

  //   await this.deleteUser(userId);
  // }
}

module.exports = UserService;
