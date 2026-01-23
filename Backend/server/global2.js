require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   1. MongoDB Connection
================================ */
mongoose
  .connect("mongodb://127.0.0.1:27017/dineinlive")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ===============================
   2. Schemas & Models
================================ */

// ---- User Schema ----
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// ---- Mess Schema ----
const MessSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  fullAddress: { type: String }, // <--- New Field for Google Maps Address
  ownerPhone: String,
  email: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // <--- Link to User
  rating: { type: Number, default: 4.0 },
  menuItems: [
    {
      name: String,
      price: Number,
      contents: String,
    },
  ],
});
const Mess = mongoose.model("Mess", MessSchema);

// ---- Order Schema ----
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messId: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true },
  messName: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", OrderSchema);

/* ===============================
   3. JWT Middleware
================================ */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretkey", (err, decoded) => { // NOTE: Changed process.env.JWT_SECRET to "secretkey" to match your Login route below
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.userId = decoded.userId;
    next();
  });
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
  } catch {
    res.status(500).json({ error: "Server error" });
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

        // Generate Token
        const token = jwt.sign({ userId: user._id }, "secretkey", { expiresIn: "1h" });
        
        res.json({ message: "Login successful", token, userId: user._id, username: user.username }); 
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
  } catch {
    res.status(500).json({ error: "Failed to fetch messes" });
  }
});

// Register Mess (UPDATED DEBUGGING)
// Register Mess (Updated with Auth)
app.post("/register-mess", verifyToken, async (req, res) => { // 1. Add verifyToken middleware
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
        ownerId: req.userId // 2. LINK THE MESS TO THE USER
    });
    
    await newMess.save();

    res.status(201).json({
      message: "Mess registered successfully",
      messId: newMess._id,
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
  } catch {
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
  } catch {
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
  } catch {
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
   7. Start Server
================================ */
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);