
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const { User } = require("../models/user");


const { ctrlWrapper } = require("../helpers");
const { HttpError } = require("../helpers");
const { Contact } = require("../models/contact");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
  
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
  
    const modAvatar = await Jimp.read(path.join(tempUpload));
    await modAvatar.resize(250, 250);
    await modAvatar.writeAsync(path.join(tempUpload));
  
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
  
    res.json({ avatarURL });
  };


const getOne = async (req, res) => {
    const { userId} = req.params;
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



module.exports = {
  getOne: ctrlWrapper(getOne),
  updateById: ctrlWrapper(updateById),
  updateAvatar: ctrlWrapper(updateAvatar),
};
