/**
 * Middleware to check if specified entities exist in the database.
 * Supports both required and optional fields.
 *
 * @param {Array} entitiesToCheck - Array of objects containing model, fieldName, friendlyName, and optional flag.
 */
const checkEntitiesExist = (entitiesToCheck) => async (req, res, next) => {
  try {
    for (const {
      model,
      fieldName,
      friendlyName,
      optional,
    } of entitiesToCheck) {
      const id = req.body[fieldName];

      // If the field is optional and not provided, skip the check
      if (optional && !id) {
        continue;
      }

      // If the field is required but missing, throw an error
      if (!id) {
        return res
          .status(400)
          .json({ message: `${fieldName} is required in the request body` });
      }

      // Handle arrays (like payment_ids) and single values
      if (Array.isArray(id)) {
        for (const singleId of id) {
          const entity = await model.findOne({ _id: singleId });
          if (!entity) {
            return res.status(400).json({
              message: `${friendlyName} with ID ${singleId} not found`,
            });
          }
        }
      } else {
        const entity = await model.findOne({ _id: id });
        if (!entity) {
          return res
            .status(400)
            .json({ message: `${friendlyName} with ID ${id} not found` });
        }
      }
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in checkEntitiesExist middleware:", error.message);
    res
      .status(500)
      .json({ message: "Server error while checking entity existence" });
  }
};

module.exports = checkEntitiesExist;
