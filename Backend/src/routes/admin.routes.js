const express = require("express");
const adminController = require("../controllers/admin.controllers");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================
// User Management
// =====================================

// Get all users
router.get(
    "/users",
    auth.verifyToken,
    auth.verifyAdmin,
    adminController.getAllUsers
);

// Delete a user
router.delete(
    "/users/:id",
    auth.verifyToken,
    auth.verifyAdmin,
    adminController.deleteUser
);

// Change a user's role
router.patch(
    "/users/:id/role",
    auth.verifyToken,
    auth.verifyAdmin,
    adminController.updateUserRole
);


// =====================================
// Mess Management
// =====================================

// Get all messes
router.get(
    "/messes",
    auth.verifyToken,
    auth.verifyAdmin,
    adminController.getAllMesses
);

// Delete a mess
router.delete(
    "/messes/:id",
    auth.verifyToken,
    auth.verifyAdmin,
    adminController.deleteMess
);


// =====================================
// Initial Admin Setup
// =====================================

// Make the first admin
router.post(
    "/seed-admin",
    adminController.seedAdmin
);

module.exports = router;