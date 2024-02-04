const express = require("express");

const { schemas } = require("../../models/user");

const { validateBody, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.post("/forgot-password", authenticate, ctrl.forgotPassword);

// router.post("/refresh", validateBody(schemas.refreshSchema), ctrl.refresh);

// const {
//   validateBody,
//   authenticate,
//   ppassport,
//   passport,
// } = require("../../middlewares");

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   ctrl.googleAuth
// );

module.exports = router;
