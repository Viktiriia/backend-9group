const { User } = require("../models/user");
const bcrypt = require("bcrypt");

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
  const { _id } = req.user;
  const result = await User.findById(_id);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  const responseData = {
    name: result.name,
    email: result.email,
    avatarURL: result.avatarURL,
    gender: result.gender,
    dailyNorma: result.dailyNorma,
  };

  res.json(responseData);
};

const getUserUpdateById = async (req, res) => {
  let updatedUser;

  const { _id } = req.user;
  const { name, gender, password, dailyNorma, newPassword } = req.body;

  const result = await User.findByIdAndUpdate(
    _id,
    { name, dailyNorma, gender },
    { new: true }
  ).populate("_id email password");

  if (!result) {
    throw new HttpError(404, "Not found");
  }

  if (!result) {
    throw HttpError(404, "Not found");
  }

  if (password && newPassword) {
    if (password === newPassword) {
      throw HttpError(
        401,
        "The new password cannot be identical to the old one"
      );
    }

    const user = await User.findById(_id);
    if (!user) {
      throw HttpError(404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(422).json({
        message: "Provided password does not match user's current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    updatedUser = await user.save();
  } else {
    const updateInfo = { name, gender };
    updatedUser = await User.findByIdAndUpdate(_id, updateInfo, { new: true });
    if (!updatedUser) {
      throw HttpError(404);
    }
  }

  res.json({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      dailyNorma,
    },
  });
};

const waterRate = async (req, res) => {
  const { _id } = req.user;
  const { dailyNorma } = req.body;

  if (dailyNorma > 15) {
    throw HttpError(400, "The daily rate can be a maximum of 15 l");
  }

  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });

  if (!result) {
    throw HttpError(404, "User not found");
  }

  res.json({ dailyNorma });
};

module.exports = {
  getInfoUser: ctrlWrapper(getInfoUser),
  getUserUpdateById: ctrlWrapper(getUserUpdateById),
  updateAvatar: ctrlWrapper(updateAvatar),
  waterRate: ctrlWrapper(waterRate),
};
