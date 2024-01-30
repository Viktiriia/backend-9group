const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { handleMongooseError, calculateDailyNorm } = require("../helpers");

const dailySchema = new Schema(
  {
    dailyNorma: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    activeTime: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

dailySchema.post("save", handleMongooseError, calculateDailyNorm);

const dailyNormaSchema = Joi.object({});

const schemas = {
  dailyNormaSchema,
};

const DailyNorma = model("contact", dailySchema);

module.exports = { DailyNorma, schemas };
