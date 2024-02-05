const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user");

const { schemas } = require("../../models/user");

const {
  isValidId,
  validateBody,
  authenticate,
  upload,
} = require("../../middlewares");

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

router.get("/:userId", authenticate, isValidId, ctrl.getInfoUser);

router.patch(
  "/update/:userId",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.getUserUpdateById
);

router.patch(
  "/water-rate",
  authenticate,
  validateBody(schemas.waterRateSchema),
  ctrl.waterRate
);

// router.patch("/change-password", authenticate, ctrl.changePassword);

module.exports = router;
