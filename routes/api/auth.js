const express = require("express");

const { schemas } = require("../../Schemas/userSchemas");

const { validateBody, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.post(
  "/forgot-password",
  validateBody(schemas.emailSchema),
  ctrl.forgotPassword
);

router.patch(
  "/reset-password",
  authenticate,
  validateBody(schemas.resetPassword),
  ctrl.resetPassword
);

module.exports = router;
