const express = require("express");
const validateBody = require("../../middlewares/vaidateBody");
const { schemas } = require("../../models/water");
const ctrl = require("../../controllers/water");
const { authenticate, isValidId } = require("../../middlewares");

const router = express.Router();

// - Додавання запису по спожитій воді
router.post(
  "/add",
  authenticate,
  validateBody(schemas.entriesWaterSchemas),
  ctrl.addWater
);

// - Редагування запису по спожитій воді
router.put(
  "/update/:waterId",
  authenticate,
  validateBody(schemas.updateWaterSchemas),
  ctrl.updateWater
);

<<<<<<< Updated upstream


router.delete("/:waterId", authenticate, isValidId, ctrl.deleteWater);
=======
// - Видалення запису по спожитій воді
router.delete("/:id", authenticate, isValidId, ctrl.deleteWater);
>>>>>>> Stashed changes

// router.get("/amountdaily", authenticate, ctrl.getAmountDaily);

module.exports = router;
