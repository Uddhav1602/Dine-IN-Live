const User = require("../models/user.model");
const Mess = require("../models/mess.model");

// ===============================
// Get All Users
// ===============================
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password");

        res.status(200).json(users);

    } catch (err) {
        console.error("Fetch admin users error:", err);

        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
};

// ===============================
// Delete User
// ===============================
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Prevent admin from deleting their own account
        if (user._id.toString() === req.userId) {
            return res.status(400).json({
                error: "You cannot delete your own admin account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (err) {
        console.error("Delete user error:", err);

        res.status(500).json({
            error: "Could not delete user"
        });
    }
};

// ===============================
// Change User Role
// ===============================
const updateUserRole = async (req, res) => {
    const { role } = req.body;

    const allowedRoles = [
        "user",
        "mess_owner",
        "admin"
    ];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            error: "Invalid role"
        });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Prevent admin from removing their own admin access
        if (
            user._id.toString() === req.userId &&
            role !== "admin"
        ) {
            return res.status(400).json({
                error: "You cannot remove your own admin role"
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            message: "User role updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Update user role error:", err);

        res.status(500).json({
            error: "Failed to update user role"
        });
    }
};

// ===============================
// Get All Messes
// ===============================
const getAllMesses = async (req, res) => {
    try {
        const messes = await Mess.find();

        res.status(200).json(messes);

    } catch (err) {
        console.error("Fetch admin messes error:", err);

        res.status(500).json({
            error: "Failed to fetch messes"
        });
    }
};

// ===============================
// Delete Mess
// ===============================
const deleteMess = async (req, res) => {
    try {
        const mess = await Mess.findById(req.params.id);

        if (!mess) {
            return res.status(404).json({
                error: "Mess not found"
            });
        }

        await Mess.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Mess deleted successfully"
        });

    } catch (err) {
        console.error("Admin delete mess error:", err);

        res.status(500).json({
            error: "Failed to delete mess"
        });
    }
};

// ===============================
// Seed First Admin
// ===============================
const seedAdmin = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            error: "Username is required"
        });
    }

    try {
        const existingAdmin = await User.findOne({
            role: "admin"
        });

        if (existingAdmin) {
            return res.status(403).json({
                error: "An admin already exists"
            });
        }

        const user = await User.findOne({
            username
        });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        user.role = "admin";
        await user.save();

        res.status(200).json({
            message: `✅ ${username} is now the first admin`,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Seed admin error:", err);

        res.status(500).json({
            error: "Failed to seed admin"
        });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    updateUserRole,
    getAllMesses,
    deleteMess,
    seedAdmin
};