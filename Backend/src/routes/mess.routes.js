const express = require("express")
const messController = require("../controllers/mess.controllers")
const auth = require("../middleware/auth.middleware")

const router = express.Router()


router.get("/", messController.getAllmess);

router.post("/register-mess", auth.verifyToken,messController.registerMess );

router.get("/my-mess", auth.verifyToken, messController.getMyMess);

// 🔹 NEW ROUTE: Add Menu Item
router.post("/:id/menu", auth.verifyToken, messController.addMenu);

// 🔹 NEW ROUTE: Delete Menu Item
router.delete("/:messId/menu/:itemId", auth.verifyToken, messController.deleteMenu);

// Delete mess (Admin/Owner)
router.delete("//:id", messController.deleteMess);

/* ===============================
   6. Order Routes (Protected)
================================ */

// Place order
router.post("/place/orders", auth.verifyToken, messController.placeOrder);

// Get user orders
router.get("/api/user/orders", auth.verifyToken, messController.getOrders);

// GET single mess by ID
router.get("/api/messes/:id", messController.getMessById);

// 🔹 NEW ROUTE: Get User Profile
router.get("/api/user/profile", auth.verifyToken, messController.getUserProfiles);

/* ===============================
   7. Admin Routes (auth.verifyToken + verifyAdmin)
================================ */

// Get all users (Admin only)
router.get("/api/admin/users", auth.verifyToken, auth.verifyAdmin, messController.getAllUsers);

// Delete a user (Admin only)
router.delete("/api/admin/users/:id", auth.verifyToken, auth.verifyAdmin, messController.deleteUser);

// Promote a user to admin (Admin only — used to grant admin to other users)
router.post("/api/admin/make-admin", auth.verifyToken, auth.verifyAdmin, messController.userToAdmin);

// Bootstrap: Make the FIRST admin by username — only works if NO admin exists yet
// Use this once via: POST http://localhost:5000/api/admin/seed-admin { "username": "yourUsername" }

router.post("/api/admin/seed-admin", messController.seedAdmin);

module.exports = router