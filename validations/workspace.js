const Joi = require("joi");

const workspaceSchema = Joi.object({
    name: Joi.string().required(),
    commerce: Joi.object({
        commerce_id: Joi.string().required(),
        creds: Joi.object().required(),
    }).required(),
    cms: Joi.object({
        cms_id: Joi.string().required(),
        creds: Joi.object().required(),
    }).required(),
    crm: Joi.object({
        crm_id: Joi.string().required(),
        creds: Joi.object().required(),
    }).required(),
    search: Joi.object({
        search_id: Joi.string().required(),
        creds: Joi.object().required(),
    }).required(),
    payment: Joi.object({
        payment_id: Joi.string().required(),
        creds: Joi.object().required(),
    }).required(),
    composer_url: Joi.string().required().default("https://universalcomposer.com"),
    user_id: Joi.string().required(),
    template_id: Joi.string().required(),
});

module.exports = {
    workspaceSchema,
};