const AuthServices = require("../services/auth");
const UserService = require("../services/user");
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = AuthServices.verifyToken(token);
    const userId = decoded.id;
    const user = await UserService.getUserByIdNoImgUrl(userId);
    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized. Invalid token",
    });
  }
};

module.exports = authMiddleware;
