const express = require("express");
const orderController = require("../controllers/order.controllers");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// ===============================
// Order Routes
// ===============================

// Place a new order
router.post(
    "/",
    auth.verifyToken,
    orderController.placeOrder
);

// Get current user's orders
router.get(
    "/my",
    auth.verifyToken,
    orderController.getMyOrders
);

// Get a single order
router.get(
    "/:id",
    auth.verifyToken,
    orderController.getOrderById
);

module.exports = router;