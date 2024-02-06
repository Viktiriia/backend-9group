const Joi = require("joi");

const entriesWaterSchemas = Joi.object({
  amountWater: Joi.number().min(1).max(15000),
  time: Joi.string()
});

const updateWaterSchemas = Joi.object({
  amountWater: Joi.number().min(1).max(15000),
  time: Joi.string()
});

const schemas = {
  entriesWaterSchemas,
  updateWaterSchemas,
};

module.exports = {
  schemas,
};
