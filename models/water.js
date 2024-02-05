const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const { Schema, model } = require("mongoose");

const waterSchema = new Schema(
  {
    entries: [
      {
        amountWater: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
        day: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmountWater: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

waterSchema.post("save", handleMongooseError);

const entriesWaterSchemas = Joi.object({
  amountWater: Joi.number().min(1).max(15000),
  day: Joi.number().min(1).max(31),
});

const updateWaterSchemas = Joi.object({
  amountWater: Joi.number().min(1).max(15000),
  day: Joi.number().min(1).max(31),
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
