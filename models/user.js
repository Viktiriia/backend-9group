const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const emailRegexp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

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
      match: emailRegexp,
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
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false }
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

// const refreshSchema = Joi.object({
//   refreshToken: Joi.string().required(),
// });

const addSchema = Joi.object({
  name: Joi.string(),
  gender: Joi.string(),
  avatarURL: Joi.string(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).max(64),
  newPassword: Joi.string().min(8).max(64),
});

const waterRateSchema = Joi.object({
  dailyNorma: Joi.number()
    .required()
    .max(15)
    .message({ "any.required": "missing required dailyNorma field" }),
});

const schemas = {
  registerSchema,
  loginSchema,
  // refreshSchema,
  addSchema,
  waterRateSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
