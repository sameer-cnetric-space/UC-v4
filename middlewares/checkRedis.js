const redisClient = require("../config/redisClient");

const checkRedis = async (req, res, next) => {
  try {
    // Check if Redis client is connected and ready
    if (!redisClient.isOpen) {
      console.error("Redis is not connected. Shutting down the server.");
      process.exit(1); // Exit the server process
    }
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Redis connection check failed:", error.message);
    res
      .status(500)
      .send({ message: "Internal Server Error: Redis is unreachable." });
  }
};

module.exports = checkRedis;
