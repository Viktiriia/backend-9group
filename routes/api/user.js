const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user");

const { schemas } = require("../../models/contact");

const {
  isValidId,
  validateBody,
  authenticate,
  upload,
} = require("../../middlewares");

const { schemas } = require("../schemas");
// Створити ендпоінт для додавання/зміни зображення, аватару користувача
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

// Створити ендпоінт для отримання інформації про користувача
router.get("/:userId", authenticate, isValidId, ctrl.getOne);

// Створити ендпоінт для оновлення інформації про користувача або одного з полів контактної інформації
router.put(
  "/:userId",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateById
);
