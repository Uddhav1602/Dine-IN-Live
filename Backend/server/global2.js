require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("../src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB()

/* ===============================
   2. Schemas & Models
================================ */

// ---- User Schema ----


// ---- Mess Schema ----


// ---- Order Schema ----


/* ===============================
   3. JWT Middleware
================================ */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = decoded.userId;

    // Always fetch the current role from the database instead of trusting
    // the JWT payload — this ensures role changes (e.g. admin promotion)
    // take effect immediately without requiring re-login
    const user = await User.findById(decoded.userId).select("role");
    if (!user) return res.status(401).json({ error: "User not found" });

    req.role = user.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Admin-only middleware
const verifyAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
};

// Mess Owner (or Admin) middleware
const verifyMessOwner = (req, res, next) => {
  if (req.role !== "mess_owner" && req.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Mess owners only" });
  }
  next();
};

/* ===============================
   4. Authentication Routes
================================ */

// Register User
app.post("/register", async (req, res) => {
  const { username, email, phone, address, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    console.log(`🔹 Login Attempt for: ${username}`);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate Token — embed role so middleware can read it without a DB call
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET || "secretkey",
          { expiresIn: "7d" }
        );

        res.json({
          message: "Login successful",
          token,
          userId: user._id,
          username: user.username,
          role: user.role       // Send role to frontend
        });
    } catch (err) {
        console.error("❌ SERVER ERROR:", err);
        res.status(500).json({ error: "Login failed due to server error" });
    }
});

/* ===============================
   5. Mess Routes
================================ */

// Get all messes
app.get("/api/messes", async (req, res) => {
  try {
    const messes = await Mess.find();
    res.json(messes);
  } catch (err) {
    console.error("Fetch messes error:", err);
    res.status(500).json({ error: "Failed to fetch messes" });
  }
});

// Register Mess (UPDATED DEBUGGING)
// Register Mess (Updated with Auth)
app.post("/register-mess", verifyToken, async (req, res) => {
  const { name, location, fullAddress, ownerPhone, email } = req.body;

  if (!name || !location)
    return res.status(400).json({ error: "Name and location required" });

  try {
    const existingMess = await Mess.findOne({ name });
    if (existingMess)
      return res.status(409).json({ error: "Mess already exists" });

    const newMess = new Mess({
        name,
        location,
        fullAddress,
        ownerPhone,
        email,
        ownerId: req.userId
    });

    await newMess.save();

    // ✅ Upgrade user role to mess_owner
    await User.findByIdAndUpdate(req.userId, { role: "mess_owner" });

    // ✅ Issue a fresh JWT with the new role so frontend updates immediately
    const freshToken = jwt.sign(
      { userId: req.userId, role: "mess_owner" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Mess registered successfully",
      messId: newMess._id,
      token: freshToken,        // Fresh token with mess_owner role
      role: "mess_owner",
      profilePage: '/mess-owner'
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Mess registration failed" });
  }
});

// 🔹 NEW ROUTE: Get My Mess (For Mess Owner Dashboard)
// This links the logged-in user to their mess using their email as a backup link
app.get("/api/my-mess", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find mess by ownerId OR by the user's email address
        const mess = await Mess.findOne({ 
            $or: [
                { ownerId: req.userId }, 
                { email: user.email } 
            ]
        });

        if (!mess) return res.status(404).json({ error: "No mess found for this user" });
        
        res.json(mess);
    } catch (err) {
        console.error("Error fetching my mess:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// 🔹 NEW ROUTE: Add Menu Item
app.post("/api/messes/:id/menu", verifyToken, async (req, res) => {
    const { name, price, contents } = req.body;
    try {
        const mess = await Mess.findById(req.params.id);
        if (!mess) return res.status(404).json({ error: "Mess not found" });

        mess.menuItems.push({ name, price, contents });
        await mess.save();

        // Return the newly added item (it will be the last one)
        res.status(201).json(mess.menuItems[mess.menuItems.length - 1]);
    } catch (err) {
        res.status(500).json({ error: "Failed to add menu item" });
    }
});

// 🔹 NEW ROUTE: Delete Menu Item
app.delete("/api/messes/:messId/menu/:itemId", verifyToken, async (req, res) => {
    try {
        const mess = await Mess.findById(req.params.messId);
        if (!mess) return res.status(404).json({ error: "Mess not found" });

        // Filter out the item to delete
        mess.menuItems = mess.menuItems.filter(item => item._id.toString() !== req.params.itemId);
        await mess.save();

        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});

// Delete mess (Admin/Owner)
app.delete("/api/messes/:id", async (req, res) => {
  try {
    await Mess.findByIdAndDelete(req.params.id);
    res.json({ message: "Mess deleted successfully" });
  } catch (err) {
    console.error("Delete mess error:", err);
    res.status(500).json({ error: "Could not delete mess" });
  }
});

/* ===============================
   6. Order Routes (Protected)
================================ */

// Place order
app.post("/api/orders", verifyToken, async (req, res) => {
  const { messId, messName, items, totalAmount } = req.body;

  if (!messId || !items || items.length === 0)
    return res.status(400).json({ error: "Invalid order data" });

  try {
    const newOrder = new Order({
      userId: req.userId,
      messId,
      messName,
      items,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Get user orders
app.get("/api/user/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET single mess by ID
app.get("/api/messes/:id", async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ error: "Mess not found" });
    res.json(mess);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mess details" });
  }
});

// 🔹 NEW ROUTE: Get User Profile
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    // Find user by ID but DO NOT send back the password
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/* ===============================
   7. Admin Routes (verifyToken + verifyAdmin)
================================ */

// Get all users (Admin only)
app.get("/api/admin/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Fetch admin users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Delete a user (Admin only)
app.delete("/api/admin/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Could not delete user" });
  }
});

// Promote a user to admin (Admin only — used to grant admin to other users)
app.post("/api/admin/make-admin", verifyToken, verifyAdmin, async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { role: "admin" },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: `${username} is now an admin`, user });
  } catch (err) {
    console.error("Make admin error:", err);
    res.status(500).json({ error: "Failed to promote user" });
  }
});

// Bootstrap: Make the FIRST admin by username — only works if NO admin exists yet
// Use this once via: POST http://localhost:5000/api/admin/seed-admin { "username": "yourUsername" }
app.post("/api/admin/seed-admin", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({ error: "An admin already exists. Use /api/admin/make-admin instead." });
    }
    const user = await User.findOneAndUpdate(
      { username },
      { role: "admin" },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: `✅ ${username} is now the first admin!`, user });
  } catch (err) {
    console.error("Seed admin error:", err);
    res.status(500).json({ error: "Failed to seed admin" });
  }
});

/* ===============================
   8. Start Server
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);