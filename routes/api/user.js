const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user");

const { schemas } = require("../../Schemas/userSchemas");

const {
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

router.get("/info", authenticate, ctrl.getInfoUser);

router.patch(
  "/update",
  authenticate,
  validateBody(schemas.addSchema),
  ctrl.getUserUpdateById
);

router.patch(
  "/water-rate",
  authenticate,
  validateBody(schemas.waterRateSchema),
  ctrl.waterRate
);

module.exports = router;
