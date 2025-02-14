const Joi = require("joi");

const registrationSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.base": "First name must be a string.",
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must have at least 2 characters.",
      "string.pattern.base": "First name must contain only letters and spaces.",
      "any.required": "First name is required.",
    }),
  last_name: Joi.string()
    .min(2)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.base": "Last name must be a string.",
      "string.empty": "Last name cannot be empty.",
      "string.min": "Last name must have at least 2 characters.",
      "string.pattern.base": "Last name must contain only letters and spaces.",
    }),
  username: Joi.string()
    .min(3)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.base": "Username must be a string.",
      "string.empty": "Username cannot be empty.",
      "string.min": "Username must have at least 3 characters.",
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores.",
      "any.required": "Username is required.",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international number with 7 to 15 digits.",
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
    }),
  profile_picture: Joi.string().uri().optional().messages({
    "string.uri": "Profile picture must be a valid URL.",
  }),
  is_active: Joi.boolean().default(true),
  role: Joi.string()
    .valid("org-admin", "template-admin", "workspace-admin")
    .required()
    .messages({
      "any.only":
        "Role must be one of org-admin, template-admin, or workspace-admin.",
      "any.required": "Role is required.",
    }),

  entity: Joi.alternatives()
    // .conditional("role", {
    //   is: "template-admin",
    //   then: Joi.object({
    //     type: Joi.string().valid("template").required().messages({
    //       "any.only": "If role is template-admin, type must be 'template'.",
    //       "any.required": "Entity type is required for template-admin.",
    //     }),
    //     id: Joi.string()
    //       .pattern(/^tmp-[a-f0-9\-]+$/)
    //       .required()
    //       .messages({
    //         "string.pattern.base":
    //           "Entity ID must be in the format 'tmp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' for templates.",
    //         "any.required": "Entity ID is required for template-admin.",
    //       }),
    //   }).required(),
    // })
    .conditional("role", {
      is: "workspace-admin",
      then: Joi.object({
        type: Joi.string().valid("workspace").required().messages({
          "any.only": "If role is workspace-admin, type must be 'workspace'.",
          "any.required": "Entity type is required for workspace-admin.",
        }),
        template_id: Joi.string()
          .pattern(/^tmp-[a-f0-9\-]+$/)
          .required()
          .messages({
            "string.pattern.base":
              "Template ID must be in the format 'tmp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.",
            "any.required": "Template ID is required for workspace-admin.",
          }),
        workspace_id: Joi.string()
          .pattern(/^wsp-[a-f0-9\-]+$/)
          .required()
          .messages({
            "string.pattern.base":
              "Workspace ID must be in the format 'wsp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.",
            "any.required": "Workspace ID is required for workspace-admin.",
          }),
      }).required(),
    })
    .default(null), // If role is org-admin, entity is not required.
});

module.exports = { registrationSchema };
