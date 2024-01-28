
const { ctrlWrapper } = require("../helpers");
const { HttpError } = require("../helpers");
const { Water } = require("../models/water");

const addWater = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await Water.create({...req.body, owner});
    res.status(201).json(result);
  };
  
  const updateWater = async (req, res) => {
    const {_id } = req.params;
    const result = await Water.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  };

  module.exports = {
    addWater: ctrlWrapper(addWater),
    updateWater: ctrlWrapper(updateWater),
  };
  