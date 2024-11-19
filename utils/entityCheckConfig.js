const Commerce = require("../models/commerce");
const CMS = require("../models/cms");
const Search = require("../models/search");
const Payment = require("../models/payments");
const bModel = require("../models/bModel");
const CRM = require("../models/crm");
const checkEntitiesExist = require("../middlewares/entityChecker");

/**
 * Generates the entity checking middleware for templates.
 * @returns {Function} Middleware to check if all required entities exist.
 */
const templateEntityCheck = () => {
  return checkEntitiesExist([
    { model: Commerce, fieldName: "commerce_id", friendlyName: "Commerce" },
    { model: CMS, fieldName: "cms_id", friendlyName: "CMS" },
    { model: Search, fieldName: "search_id", friendlyName: "Search" },
    { model: Payment, fieldName: "payment_ids", friendlyName: "Payment" }, // Handles arrays
    { model: bModel, fieldName: "bModel_id", friendlyName: "Business Model" },
    // Optional check for CRM (exists only if `crm_id` is provided)
    { model: CRM, fieldName: "crm_id", friendlyName: "CRM", optional: true },
  ]);
};

module.exports = {
  templateEntityCheck,
};
