const { ctrlWrapper } = require("../helpers");
const { HttpError } = require("../helpers");
const { Water } = require("../models/water");

const addWater = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { amountWater, day } = req.body;

  // Знайти документ, якщо він існує для даного користувача
  const existingWaterData = await Water.findOne({ owner });

  if (existingWaterData) {
    // Якщо користувач вже має дані, оновлюємо їх, використовуючи $push та $inc
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
    // Якщо користувач ще не має даних створюється новий документ
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
  const { amountWater, day } = req.body;

  //  $push для додавання нового запису до масиву entries та $inc для оновлення загальної кількості води
  const result = await Water.findOneAndUpdate(
    {'entries._id': waterId},
    {
      $push: { entries: { amountWater, day } },
      $inc: { totalAmountWater: amountWater },
    },
    { new: true }
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};




const deleteWater = async (req, res) => {
  const { _id } = req.user;
  const { waterId } = req.params;
  const { amountWater } = req.body;

    const result = await Water.findOneAndDelete({
      owner: _id,
      "entries._id": waterId
    });

    if (!result) {
      throw HttpError(404, "Not found");
    }

    // Видалення елементу з масиву entries
    result.entries.pull({ _id: waterId });

    // Оновлення totalAmountWater
    result.totalAmountWater -= amountWater;

    // Збереження оновленого документа
    await result.save();

    res.status(200).json({ message: "Entry deleted", entry: result });
  }

<<<<<<< Updated upstream
=======
  await Water.findOneAndUpdate(
    { owner: _id },
    {
      $pull: { entries: { _id: entryId } },
      $inc: { totalAmountWater: -entryToDelete.amountWater },
    },
    { new: true }
  );

  res.status(200).json({ message: "Entry deleted" });
};


>>>>>>> Stashed changes
module.exports = {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
};
