const fs = require("fs/promises");
const { User } = require("../models/user");
const { Contact } = require("../models/contact");
const path = require("path");

const { ctrlWrapper } = require("../helpers");
const { HttpError } = require("../helpers");

const updateAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const { _id } = req.user;

  const avatarURL = req.file.path;
  const user = await User.findByIdAndUpdate(_id);

  user.avatarURL = avatarURL;
  user.save();

  res.json({ avatarURL: user.avatarURL });
};

const getOne = async (req, res) => {
  const { userId } = req.params;
  const result = await Contact.findById(userId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateById = async (req, res) => {
  const { _id } = req.user;
  const { userId } = req.params;
  const result = await Contact.findByIdAndUpdate(
    {
      _id: userId,
      owner: _id,
    },
    req.body,
    {
      new: true,
    }
  ).populate("owner", "_id email subscription");
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const dailyNorma = async (req, res) => {
  const { _id } = req.user;
  const { dailyNorma } = req.body;

  if (!dailyNorma > 15) {
    throw HttpError(400, "Daily water standard exceeded ");
  }

  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({ dailyNorma });
};

module.exports = {
  getOne: ctrlWrapper(getOne),
  updateById: ctrlWrapper(updateById),
  updateAvatar: ctrlWrapper(updateAvatar),
  dailyNorma: ctrlWrapper(dailyNorma),
};
