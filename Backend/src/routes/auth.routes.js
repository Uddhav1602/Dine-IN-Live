const express = require("express");
const authController = require("../controllers/auth.controllers");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// Authentication
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

// Get currently logged-in user's basic identity
router.get(
    "/me",
    auth.verifyToken,
    authController.getCurrentUser
);

// Check authentication status
router.get(
    "/check-auth",
    auth.verifyToken,
    (req, res) => {
        res.set("Cache-Control", "no-store");

        res.status(200).json({
            authenticated: true,
            userId: req.userId,
            role: req.role
        });
    }
);

module.exports = router;