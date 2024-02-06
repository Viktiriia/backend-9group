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
  const { amountWater } = req.body;
  const date = new Date();
  const existingWaterData = await Water.findOne({
    date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    },
    owner,
  });

  if (existingWaterData) {
    const updatedResult = await Water.findOneAndUpdate(
      { owner },
      {
        $push: { entries: { amountWater } },
        $inc: { totalAmountWater: amountWater },
      },
      { new: true }
    );

    res.status(201).json(updatedResult);
  } else {
    const result = await Water.create({
      entries: [{ amountWater}],
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

const getToday = async (req, res) => {
  const { _id: owner } = req.user;

  const date = new Date();
  const waterData = await Water.findOne({
    date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    },
    owner,
  });

  if (!waterData) {
    res.json({
      totalWater: 0,
      percentage: 0,
      entries: [],
    });
    return;
  }

  const totalAmountWater = waterData.totalAmountWater || 0;
  const dailyNorma = waterData.dailyNorma || 1;

  const dailyWater = {
    totalWater: waterData.entries.length,
    percentage: Math.floor((totalAmountWater / (dailyNorma * 1000)) * 100),
    entries: waterData.entries,
  };

  res.json(dailyWater);
};

const monthInfo = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.params;

  const [year, month] = date.split("-");
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0));

  const waterOfMonth = await Water.find({
    date: { $gte: startDate, $lte: endDate },
    owner,
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const result = waterOfMonth.map((entry) => {
    const getMonth = entry.date.getMonth();
    const getDay = entry.date.getDate();
    const dailyNorma = entry.dailyNorma || 2;
    const totalAmountWater = entry.totalAmountWater || 0;

    return {
      date: `${months[getMonth]}, ${getDay}`,
      dailyNorma: `${dailyNorma} L`,
      percentage: Math.floor((totalAmountWater / (dailyNorma * 1000)) * 100),
      recordsWaterConsumption: entry.entries.length,
    };
  });

  res.json(result);
};

module.exports = {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
  getToday: ctrlWrapper(getToday),
  monthInfo: ctrlWrapper(monthInfo),
};
