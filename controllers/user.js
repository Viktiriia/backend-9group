const { User } = require("../models/user");

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

const getInfoUser = async (req, res) => {
  const { _id } = req.params;
  const result = await User.findById(_id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const getUserUpdateById = async (req, res) => {
  const { _id } = req.user;
  const { name, avatarURL, gender, water } = req.body;

  const result = await User.findByIdAndUpdate(
    _id,
    { name, avatarURL, gender, water },
    { new: true }
  ).populate("_id email password");

  if (!result) {
    throw new HttpError(404, "Not found");
  }

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({ name, avatarURL, gender, water });
};

module.exports = {
  getInfoUser: ctrlWrapper(getInfoUser),
  getUserUpdateById: ctrlWrapper(getUserUpdateById),
  updateAvatar: ctrlWrapper(updateAvatar),
};
