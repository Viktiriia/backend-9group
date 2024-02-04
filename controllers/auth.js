const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/user");
const { TOKEN_KEY } = process.env;
const { nanoid } = require("nanoid");
// const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, } = process.env;

const { ctrlWrapper } = require("../helpers");
const { HttpError } = require("../helpers");
const gravatar = require("gravatar");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const userName = email.split("@")[0];

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    name: userName,
    verificationToken,
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
  const { email, password } = req.body;
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
  await User.findByIdAndUpdate(user._id, { token, verify: true });

  res.status(200).json({
    token,
    user: {
      email: user.email,
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
  res.json({
    Authorization: "Bearer {{token}}",
  });
};

// const logout = async (req, res) => {
//   const { _id } = req.user;
//   await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });
//   res.json({
//     message: "Logout success",
//   });
// };

// const refresh = async (req, res) => {
//   const { refreshToken: token } = req.body;
//   try {
//     const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
//     const isExist = await User.findOne({ refreshToken: token });
//     if (!isExist) {
//       throw HttpError(403, "Token invalid");
//     }

//     const payload = {
//       id,
//     };

//     const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
//       expiresIn: "2m",
//     });
//     const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
//       expiresIn: "7d",
//     });

//     res.json({
//       accessToken,
//       refreshToken,
//     });
//   } catch (error) {
//     throw HttpError(403, error.message);
//   }
// };

const forgotPassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email is wrong");
  }

  const isCorrectPassword = await bcrypt.compare(password, foundUser.password);
  if (!isCorrectPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newPassword = await User.create({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    email: newPassword.email,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  forgotPassword: ctrlWrapper(forgotPassword),
  // refresh: ctrlWrapper(refresh),
};
