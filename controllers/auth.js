const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs/promises");
const { User } = require("../models/user");
const { TOKEN_KEY } = process.env;

const { ctrlWrapper } = require("../helpers");
const { HttpError } = require("../helpers");
const path = require("path");
const gravatar = require("gravatar");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const userName = email.split("@")[0];

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    name: userName,
  });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
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
  await User.findByIdAndUpdate(user._id, { token });
  console.log(token);
  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, gender, name, } = req.user;
  res.json({
    email,
    gender,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    Authorization: "Bearer {{token}}",
  });
};

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
    password: newPassword.password,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  forgotPassword: ctrlWrapper(forgotPassword),
};



// const { ctrlWrapper } = require("../helpers");
// const { HttpError } = require("../helpers");
// const { Contact } = require("../models/contact");

// const getOne = async (req, res) => {
//   const { _id } = req.user;
//   const { contactId } = req.params;
//   const result = await Contact.findById({
//     _id: contactId,
//     owner: _id,
//   }).populate("owner", "email subscription");
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.status(200).json(result);
// };

// const add = async (req, res) => {
//   const { _id: owner } = req.user;
//   const result = await Contact.create({ ...req.body, owner });
//   res.status(201).json({ result });
// };

// const updateById = async (req, res) => {
//   const { _id } = req.user;
//   const { contactId } = req.params;
//   const result = await Contact.findByIdAndUpdate(
//     {
//       _id: contactId,
//       owner: _id,
//     },
//     req.body,
//     {
//       new: true,
//     }
//   ).populate("owner", "_id email subscription");
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json(result);
// };

// const updateStatusContact = async (req, res) => {
//   const { _id } = req.user;
//   const { contactId } = req.params;
//   const result = await Contact.findByIdAndUpdate(
//     {
//       _id: contactId,
//       owner: _id,
//     },
//     req.body,
//     {
//       new: true,
//     }
//   ).populate("owner", "_id email subscription");
//   if (!result) {
//     throw HttpError(400, "missing field favorite");
//   }
//   res.json(result);
// };

// const removeById = async (req, res) => {
//   const { _id } = req.user;
//   const { contactId } = req.params;
//   const result = await Contact.findByIdAndDelete({
//     _id: contactId,
//     owner: _id,
//   }).populate("owner", "_id email subscription");
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.status(200).json({ message: "contact deleted" });
// };

// module.exports = {
//   getAll: ctrlWrapper(getAll),
//   getOne: ctrlWrapper(getOne),
//   add: ctrlWrapper(add),
//   updateById: ctrlWrapper(updateById),
//   updateStatusContact: ctrlWrapper(updateStatusContact),
//   removeById: ctrlWrapper(removeById),
// };
