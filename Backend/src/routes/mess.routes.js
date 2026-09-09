const express = require("express");

const messController = require("../controllers/mess.controllers");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// =====================================
// Public Mess Routes
// =====================================

// Get all messes
router.get(
    "/",
    messController.getAllMesses
);

// Get logged-in owner's mess
router.get(
    "/my",
    auth.verifyToken,
    auth.verifyMessOwner,
    messController.getMyMess
);

// Get a single mess
router.get(
    "/:id",
    messController.getMessById
);


// =====================================
// Mess Owner Routes
// =====================================

// Register a new mess
router.post(
    "/",
    auth.verifyToken,
    messController.registerMess
);

// Update mess
router.put(
    "/:id",
    auth.verifyToken,
    auth.verifyMessOwner,
    messController.updateMess
);

// Delete mess
router.delete(
    "/:id",
    auth.verifyToken,
    auth.verifyMessOwner,
    messController.deleteMess
);


// =====================================
// Menu Routes
// =====================================

// Add menu item
router.post(
    "/:messId/menu",
    auth.verifyToken,
    auth.verifyMessOwner,
    messController.addMenuItem
);

// Update menu item
router.put(
    "/:messId/menu/:itemId",
    auth.verifyToken,
    auth.verifyMessOwner,
    messController.updateMenuItem
);

// Delete menu item
router.delete(
    "/:messId/menu/:itemId",
    auth.verifyToken,
    auth.verifyMessOwner,
    messController.deleteMenuItem
);

module.exports = router;