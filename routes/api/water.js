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

router.delete("/:waterId", authenticate, isValidId, ctrl.deleteWater);

// router.get("/amountdaily", authenticate, ctrl.waterRate);

module.exports = router;
