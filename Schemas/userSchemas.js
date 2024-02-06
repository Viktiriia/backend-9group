const Joi = require("joi");

const emailRegexp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

const registerSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const addSchema = Joi.object({
  name: Joi.string(),
  gender: Joi.string(),
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
