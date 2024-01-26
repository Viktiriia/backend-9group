const express = require("express");

const { schemas } = require("../../models/user");

const { validateBody, authenticate, upload } = require("../../middlewares");

const ctrl = require("../../controllers/auth");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/forgot-password", authenticate, ctrl.forgotPassword);

// router.post("/refresh", validateBody(schemas.refreshSchema), ctrl.refresh);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;

// ++++================================================================

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
