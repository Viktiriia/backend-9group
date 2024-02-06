const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const userSchema = new Schema(
  {
    dailyNorma: {
      type: Number,
      default: 2,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = {
  User,
};
