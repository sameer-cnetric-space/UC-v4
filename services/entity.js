const cms = require("../models/cms");
const commerce = require("../models/commerce");
const crm = require("../models/crm");
const payments = require("../models/payments");
const search = require("../models/search");
const bModel = require("../models/bModel");
const { buildFileUrl } = require("../utils/buildUrl");

class EntityService {
  static async getEntities(req) {
    try {
      const defaultImagePath = "/public/assets/default.png";

      // Helper function to map entities with image URLs
      const mapEntities = (entities, type) => {
        return entities.map((entity) => ({
          id: entity._id,
          name: entity.name,
          description: entity.description,
          image_url: entity.image_url
            ? buildFileUrl(req, entity.image_url) // Use the entity's image if it exists
            : buildFileUrl(req, defaultImagePath), // Otherwise, use the default image
        }));
      };

      // Fetch entities from models and map them
      const commerces = mapEntities(await commerce.find(), "commerce");
      const crms = mapEntities(await crm.find(), "crm");
      const cmsEntities = mapEntities(await cms.find(), "cms");
      const searches = mapEntities(await search.find(), "search");
      const paymentEntities = mapEntities(await payments.find(), "payment");
      const bModels = mapEntities(await bModel.find(), "bModel");

      // Combine all results
      return {
        commerce: commerces,
        crm: crms,
        cms: cmsEntities,
        search: searches,
        payment: paymentEntities,
        bModel: bModels,
      };
    } catch (error) {
      console.error("Error in EntityService.getEntities:", error.message);
      throw new Error("Failed to fetch entities");
    }
  }

  static async getEntityById(req, type, id) {
    try {
      const models = {
        commerce,
        crm,
        cms,
        payments,
        search,
      };

      if (!models[type]) {
        throw new Error(`Invalid entity type: ${type}`);
      }

      const entity = await models[type].findById(id);
      return getImageUrl(req, type, [entity])[0]; // Map image URL for the single entity
    } catch (error) {
      console.error("Error in EntityService.getEntityById:", error.message);
      throw error;
    }
  }
}

module.exports = EntityService;
