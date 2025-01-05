const Joi = require("joi");

const templateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().optional(),
  bModel_id: Joi.string().required(),
  commerce_id: Joi.string().required(),
  cms_id: Joi.string().required(),
  crm_id: Joi.string().optional(),
  search_id: Joi.string().required(),
  payment_ids: Joi.array().items(Joi.string()).required(),
});

const templateUpdateSchema = Joi.object({
  template: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().optional(),
  }),
});

module.exports = {
  templateSchema,
  templateUpdateSchema,
};
