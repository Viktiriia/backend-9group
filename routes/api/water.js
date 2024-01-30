const express = require("express");
const validateBody = require("../../middlewares/vaidateBody");
const { schemas } = require("../../models/water");
const ctrl = require("../../controllers/water");
const { authenticate, isValidId } = require("../../middlewares");

const router = express.Router();

router.post(
  "/add",
  authenticate,
  validateBody(schemas.entriesWaterSchemas),
  ctrl.addWater
);

router.put(
  "/update/:userId",
  authenticate,
  validateBody(schemas.updateWaterSchemas),
  ctrl.updateWater
);



router.delete("/:id", authenticate, isValidId, ctrl.deleteWater);

// router.get("/amountdaily", authenticate, ctrl.getAmountDaily);

module.exports = router;
