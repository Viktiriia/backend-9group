const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const { Schema, model } = require("mongoose");

const waterSchema = new Schema(
  {
    amountWater: {
      type: Number,
      required: [true, "amountWater is required"],
    },
    date: {
      type: Number,
      required: [true, "date is required"],
    },
    day: {
      type: Number,
      required: [true, "day is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      // required: true,
    },
  },
  { versionKey: false, timestamps: false }
);


waterSchema.post("save", handleMongooseError);


// Схема валідації данних води, яку вживав користувач.

const entriesWaterSchemas = Joi.object({
  amountWater: Joi.number()
    .min(1)
    .max(15000)
});

const updateWaterSchemas = Joi.object({
  amountWater: Joi.number()
    .min(1)
    .max(15000),
  day: Joi.number()
    .min(1)
    .max(31),
});

const schemas = {
  entriesWaterSchemas,
  updateWaterSchemas,
};

const Water = model("water", waterSchema);


module.exports = {
  Water,
  schemas,
};