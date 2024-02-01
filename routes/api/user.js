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

// Створити ендпоінт для додавання/зміни зображення, аватару користувача
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

// Створити ендпоінт для отримання інформації про користувача
router.get("/:_id", authenticate, isValidId, ctrl.getInfoUser);

// Створити ендпоінт для оновлення інформації про користувача або одного з полів контактної інформації
router.put(
  "/:_id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.getUserUpdateById
);

module.exports = router;
