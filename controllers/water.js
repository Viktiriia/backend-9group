const { ctrlWrapper } = require("../helpers");
const { HttpError } = require("../helpers");
const { Water } = require("../models/water");


const findExistingEntryAndCalculateOldAmount = async (waterId) => {
  const existingEntry = await Water.findOne({ "entries._id": waterId });

  if (!existingEntry) {
    throw HttpError(404, "Not found");
  }

  const oldAmountWater = existingEntry.entries.find(
    (entry) => entry._id.toString() === waterId
  ).amountWater;
  return oldAmountWater;
};

const addWater = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { amountWater, day } = req.body;

  const existingWaterData = await Water.findOne({ owner });

  if (existingWaterData) {
    const updatedResult = await Water.findOneAndUpdate(
      { owner },
      {
        $push: { entries: { amountWater, day } },
        $inc: { totalAmountWater: amountWater },
      },
      { new: true }
    );

    res.status(201).json(updatedResult);
  } else {
    const result = await Water.create({
      entries: [{ amountWater, day }],
      totalAmountWater: amountWater,
      owner,
    });
    res.status(201).json(result);
  }
};

const updateWater = async (req, res) => {
  const { waterId } = req.params;
  const { amountWater } = req.body;

  const oldAmountWater = await findExistingEntryAndCalculateOldAmount(waterId);

  const result = await Water.findOneAndUpdate(
    { "entries._id": waterId },
    {
      $set: { "entries.$[elem].amountWater": amountWater },
      $inc: { totalAmountWater: amountWater - oldAmountWater },
    },
    {
      arrayFilters: [{ "elem._id": waterId }],
      new: true,
    }
  );

  res.json(result);
};

const deleteWater = async (req, res) => {
  const { waterId } = req.params;

  const oldAmountWater = await findExistingEntryAndCalculateOldAmount(waterId);

  const result = await Water.findOneAndUpdate(
    { "entries._id": waterId },
    {
      $pull: { entries: { _id: waterId } },
      $inc: { totalAmountWater: -oldAmountWater },
    },
    { new: true }
  );

  res.json(result);
};

// const waterRate = async (req, res) => {
//   const { _id } = req.user;
//   const { dailyNorma } = req.body;

//   if (!dailyNorma > 15) {
//     throw HttpError(400, "Daily water standard exceeded ");
//   }

//   const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }

//   res.json({ dailyNorma });
// };

module.exports = {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
};
