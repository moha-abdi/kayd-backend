const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

router.get("/me", userController.getCurrentUser);
router.get("/:userId", userController.getUserProfile);
router.put("/:userId", userController.updateUserProfile);
router.put("/:userId/change-password", userController.changePassword);
router.delete("/:userId", userController.deleteUserAccount);

module.exports = router;
