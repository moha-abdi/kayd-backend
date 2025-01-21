const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty(),
    body("phone").notEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  authController.register,
);

router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
