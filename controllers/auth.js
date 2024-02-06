const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/user");
const { TOKEN_KEY, URL_AT_SITE } = process.env;
const { nanoid } = require("nanoid");
const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");

const gravatar = require("gravatar");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const userName = email.split("@")[0];

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    name: userName,
    verificationCode,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL,
      gender: newUser.gender,
    },
  });
};

const login = async (req, res) => {
  const { email, password, dailyNorma, avatarURL, gender } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, TOKEN_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      avatarURL,
      gender,
      dailyNorma,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, gender, name, avatarURL, dailyNorma, _id } = req.user;
  res.json({
    email,
    gender,
    name,
    avatarURL,
    dailyNorma,
    _id,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res
    .status(204)
    .json({
      message: "Bearer {{token}}",
    })
    .message("No Content");
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404);
  }

  const verifyEmail = {
    to: email,
    subject: "Veriry Email",
    html: `<a target="_blank" href="${URL_AT_SITE}/forgot-password?userId=${user._id}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ email: "Email sent successfully" });
};

const resetPassword = async (req, res) => {
  const { password, id } = req.body;

  const user = await User.findOne(id);
  if (!user) {
    throw HttpError(404);
  }

  user.password = password;
  const newPassword = await bcrypt.hash(password, 10);

  user.save(newPassword);

  res.json({ message: "Password changed" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  resetPassword: ctrlWrapper(resetPassword),
  forgotPassword: ctrlWrapper(forgotPassword),
};
