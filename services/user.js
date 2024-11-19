const AuthService = require("./auth");
const User = require("../models/user");
const { buildFileUrl } = require("../utils/buildUrl");

class UserService {
  // Get User from ID
  static async getUserById(req, id) {
    const user = await User.findById(id).select("-password -salt -__v");
    if (!user) throw new Error("User not found");

    user.profile_picture = buildFileUrl(req, user.profile_picture);

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
}

module.exports = UserService;
