// const Joi = require("joi");
// const { handleMongooseError } = require("../helpers");
// const { Schema, model } = require("mongoose");

// const waterSchema = new Schema(
//   {
//     amountWater: {
//       type: Number,
//       required: [true, "amountWater is required"],
//     },
//     date: {
//       type: String,
//       required: [true, "date is required"],
//       default: new Date(),
//     },
//     day: {
//       type: Number,
//       required: [true, "day is required"],
//     },
//     owner: {
//       type: Schema.Types.ObjectId,
//       ref: "user",
//       // required: true,
//     },
//   },
//   { versionKey: false }
// );

// waterSchema.post("save", handleMongooseError);

// // Схема валідації данних води, яку вживав користувач.

// const entriesWaterSchemas = Joi.object({
//   amountWater: Joi.number().min(1).max(15000),
//   date: Joi.string(),
//   day: Joi.number().min(1).max(31),
// });

// const updateWaterSchemas = Joi.object({
//   amountWater: Joi.number().min(1).max(15000),
//   day: Joi.number().min(1).max(31),
// });

// const schemas = {
//   entriesWaterSchemas,
//   updateWaterSchemas,
// };

// const Water = model("water", waterSchema);

// module.exports = {
//   Water,
//   schemas,
// };

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
        date: {
          type: String,
          default: new Date(),
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
  date: Joi.string(),
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