const Joi = require("joi");

const templateSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    user_id: Joi.string().required(),
    bModel_id: Joi.string().required(),
    commerce_id: Joi.string().required(),
    cms_id: Joi.string().required(),
    crm_id: Joi.string().required(),
    search_id: Joi.string().required(),
    payment_id: Joi.string().required(),
    type: Joi.string().valid("Custom", "Present").required(),
});

module.exports = {
    templateSchema,
};