const Joi = require("joi");

const emailRegexp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

const registerSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegexp).required().empty(false).messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
});

const loginSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegexp).required().empty(false).messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
});

const addSchema = Joi.object({
  name: Joi.string(),
  gender: Joi.string().valid("woman", "man"),
  avatarURL: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(8).max(64),
  newPassword: Joi.string().min(8).max(64),
});

const waterRateSchema = Joi.object({
  dailyNorma: Joi.number()
    .required()
    .max(15)
    .message({ "any.required": "missing required dailyNorma field" }),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .email()
    .required()
    .messages({ "any.required": "missing required email field" }),
});

const resetPassword = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  id: Joi.string().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  addSchema,
  waterRateSchema,
  emailSchema,
  resetPassword,
};

module.exports = {
  schemas,
};
