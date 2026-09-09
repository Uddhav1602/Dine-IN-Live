const express = require("express");
const userController = require("../controllers/user.controllers");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// Get currently logged-in user's profile
router.get(
    "/me",
    auth.verifyToken,
    userController.getMyProfile
);

module.exports = router;