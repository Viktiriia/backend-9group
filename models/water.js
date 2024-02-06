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

const Water = model("water", waterSchema);

module.exports = {
  Water,
};
