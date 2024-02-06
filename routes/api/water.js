const express = require("express");
const validateBody = require("../../middlewares/vaidateBody");
const { schemas } = require("../../Schemas/waterSchemas");

const ctrl = require("../../controllers/water");
const {
  authenticate,
  isValidId,
  isValidateMonth,
} = require("../../middlewares");

const router = express.Router();

router.post(
  "/add",
  authenticate,
  validateBody(schemas.entriesWaterSchemas),
  ctrl.addWater
);

router.put(
  "/update/:waterId",
  authenticate,
  isValidId,
  validateBody(schemas.updateWaterSchemas),
  ctrl.updateWater
);

router.delete("/:waterId", authenticate, isValidId, ctrl.deleteWater);

router.get("/today", authenticate, ctrl.getToday);

router.get("/month/:date", authenticate, isValidateMonth, ctrl.monthInfo);

module.exports = router;
