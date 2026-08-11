const User = require("../models/user.model")
const Mess = require("../models/mess.model")
const Order = require('../models/order.model')

const getAllmess = async (req, res) => {

    try {

        const messes = await Mess.find();
        res.json(messes);

    } catch (err) {

        console.error("Fetch messes error:", err);
        res.status(500).json({ error: "Failed to fetch messes" });

    }
}

// Register Mess (UPDATED DEBUGGING)
// Register Mess (Updated with Auth)

const registerMess = async (req, res) => {
    
  const { name, location, fullAddress, ownerPhone, email } = req.body;

  if (!name || !location)
    return res.status(400).json({ error: "Name and location required" });

  try {
    const existingMess = await Mess.findOne({ name });
    if (existingMess)
      return res.status(409).json({ error: "Mess already exists" });

    const newMess = await Mess.create({
        name,
        location,
        fullAddress,
        ownerPhone,
        email,
        ownerId: req.userId
    });

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
}


// 🔹 NEW ROUTE: Get My Mess (For Mess Owner Dashboard)
// This links the logged-in user to their mess using their email as a backup link

const getMyMess = async (req, res) => {

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
}

const addMenu = async (req, res) => {
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
}

const deleteMenu = async (req, res) => {
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
}

const deleteMess = async (req, res) => {
    try {
        await Mess.findByIdAndDelete(req.params.id);
        res.json({ message: "Mess deleted successfully" });
    } catch (err) {
        console.error("Delete mess error:", err);
        res.status(500).json({ error: "Could not delete mess" });
    }
}


// Order Routes


// Get user orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({
        createdAt: -1,
        });
        res.json(orders);
    } catch (err) {
        console.error("Fetch orders error:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
}


// GET single mess by ID

const getMessById = async (req, res) => {
    try {
        const mess = await Mess.findById(req.params.id);
        if (!mess) return res.status(404).json({ error: "Mess not found" });
        res.json(mess);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch mess details" });
    }
}

// place order

const placeOrder = async (req, res) => {

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

}

// 🔹 NEW ROUTE: Get User Profile
const getUserProfiles = async (req, res) => {
    try {
        // Find user by ID but DO NOT send back the password
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
}

/* ===============================
   7. Admin Routes (auth.verifyToken + verifyAdmin)
================================ */


// Get all users (Admin only)
const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");
        res.json(users);

    } catch (err) {

        console.error("Fetch admin users error:", err);
        res.status(500).json({ error: "Failed to fetch users" });

    }
}

// Delete a user (Admin only)
const deleteUser = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
        
    } catch (err) {

        console.error("Delete user error:", err);
        res.status(500).json({ error: "Could not delete user" });

    }
}


// Promote a user to admin (Admin only — used to grant admin to other users)
const userToAdmin = async (req, res) => {
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
}

// Bootstrap: Make the FIRST admin by username — only works if NO admin exists yet
// Use this once via: POST http://localhost:5000/api/admin/seed-admin { "username": "yourUsername" }

const seedAdmin = async (req, res) => {

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
}

module.exports = 
    {   
        getAllmess,registerMess,getMyMess,addMenu,deleteMenu,deleteMess,getOrders,getMessById,placeOrder,
        getUserProfiles,getAllUsers,deleteUser,userToAdmin,seedAdmin
    }