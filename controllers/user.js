const UserService = require("../services/user");

class UserController {
  // Register new User
  static async registerUser(req, res) {
    try {
      const {
        first_name,
        last_name,
        username,
        email,
        password,
        phone_number,
        profile_picture,
        is_active,
        role,
      } = req.body;

      const newUser = await UserService.createUser({
        first_name,
        last_name,
        username,
        email,
        password,
        phone_number,
        profile_picture,
        is_active,
        role,
      });

      return res.status(201).json({
        message: "User created successfully",
        token: newUser.token,
        user: newUser.user,
      });
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate field error
        return res.status(409).json({
          message: "Email, Username, or Phone Number already exists",
        });
      }
      return res.status(500).json({
        message: "Error registering user",
        error: error.message,
      });
    }
  }

  // User login
  static async userLogin(req, res) {
    try {
      const { login, password } = req.body; // `login` can be email or username

      const userToken = await UserService.getUserToken({ login, password });

      return res.status(200).json({
        message: "Login successful",
        token: userToken,
      });
    } catch (error) {
      if (
        error.message === "User not found" ||
        error.message === "Invalid credentials" ||
        error.message === "User is not active, Please contact your admin."
      ) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({
        message: "Error logging in",
        error: error.message,
      });
    }
  }

  // Get User details
  static async getUserDetails(req, res) {
    try {
      const user_id = req.userId;

      const user = await UserService.getUserById(req, user_id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        me: user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching user data",
        error: error.message,
      });
    }
  }

  // Update User
  static async updateUser(req, res) {
    try {
      const updates = req.body;

      const updatedUser = await UserService.updateUser(updates, req.userId);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Email, Username, or Phone Number already exists",
        });
      }
      return res.status(500).json({
        message: "Error updating user data",
        error: error.message,
      });
    }
  }

  // Delete User
  static async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting user data",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
