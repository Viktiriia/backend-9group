const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const emailRegexp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

const userSchema = new Schema(
  {
    dailyNorma: {
      type: Number,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
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
    // accessToken: {
    //   type: String,
    // },
    // refreshToken: {
    //   type: String,
    // },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
      select: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const addSchema = Joi.object({
  name: Joi.string(),
  gender: Joi.string(),
  avatarURL: Joi.string(),
});

const schemas = {
  registerSchema,
  loginSchema,
  refreshSchema,
  addSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
