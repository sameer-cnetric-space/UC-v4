const Joi = require("joi");

const workspaceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string()
    .optional()
    .default(
      "Your central hub for seamless project management and collaboration."
    ),
  creds: Joi.object({
    commerce: Joi.object().required(), // Any object structure allowed
    cms: Joi.object().required(), // Any object structure allowed
    crm: Joi.object().optional(), // Optional and can have any object structure
    search: Joi.object().required(), // Any object structure allowed
    payment: Joi.array()
      .items(Joi.object()) // Array of objects with any structure
      .min(1) // At least one payment credential required
      .required(),
  }).required(),
  composer_url: Joi.string()
    .uri()
    .optional()
    .default("https://universalcomposer.com"), // Default composer_url
  template_id: Joi.string().required(), // Template ID is mandatory
});

module.exports = {
  workspaceSchema,
};
