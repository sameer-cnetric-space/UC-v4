const Joi = require("joi");

const postOrganizationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow("").optional(),
});

module.exports = {
  postOrganizationSchema,
};
