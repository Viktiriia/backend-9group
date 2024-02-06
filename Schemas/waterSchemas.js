const Joi = require("joi");

const entriesWaterSchemas = Joi.object({
  amountWater: Joi.number().min(1).max(15000),
});

const updateWaterSchemas = Joi.object({
  amountWater: Joi.number().min(1).max(15000),
  day: Joi.number().min(1).max(31),
});

const schemas = {
  entriesWaterSchemas,
  updateWaterSchemas,
};

module.exports = {
  schemas,
};
