const EntityService = require("../services/entity");

class EntityController {
  /**
   * Fetch all entities.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getEntities(req, res) {
    try {
      const entities = await EntityService.getEntities(req);
      return res.status(200).json({
        entities,
      });
    } catch (error) {
      console.error("Error in EntityController.getEntities:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch entities",
        error: error.message,
      });
    }
  }

  /**
   * Fetch a single entity by type and ID.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getEntityById(req, res) {
    const { type, id } = req.params;
    try {
      const entity = await EntityService.getEntityById(req, type, id);

      if (!entity) {
        return res.status(404).json({
          status: "error",
          message: `${type} entity with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        status: "success",
        data: entity,
      });
    } catch (error) {
      console.error("Error in EntityController.getEntityById:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch entity",
        error: error.message,
      });
    }
  }

  /**
   * Fetch all themes.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getThemes(req, res) {
    try {
      const themes = await EntityService.getThemes(req);
      return res.status(200).json({
        themes,
      });
    } catch (error) {
      console.error("Error in ThemeController.getThemes:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch themes",
        error: error.message,
      });
    }
  }
}

module.exports = EntityController;
