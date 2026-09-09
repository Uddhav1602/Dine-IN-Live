const User = require("../models/user.model");
const Mess = require("../models/mess.model");

// ===============================
// Get All Messes
// ===============================
const getAllMesses = async (req, res) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 10
        } = req.query;

        const currentPage = Math.max(Number(page), 1);
        const itemsPerPage = Math.max(Number(limit), 1);

        const searchRegex = new RegExp(search, "i");

        const filter = search
            ? {
                $or: [
                    { name: searchRegex },
                    { location: searchRegex }
                ]
            }
            : {};

        const totalMesses = await Mess.countDocuments(filter);

        const totalPages = Math.ceil(
            totalMesses / itemsPerPage
        );

        const messes = await Mess.find(filter)
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.status(200).json({
            messes,
            currentPage,
            totalPages,
            totalMesses
        });

    } catch (err) {
        console.error("Fetch messes error:", err);

        res.status(500).json({
            error: "Failed to fetch messes"
        });
    }
};

// ===============================
// Get Single Mess
// ===============================
const getMessById = async (req, res) => {
    try {
        const mess = await Mess.findById(req.params.id);

        if (!mess) {
            return res.status(404).json({
                error: "Mess not found"
            });
        }

        res.status(200).json(mess);
    } catch (err) {
        console.error("Fetch mess details error:", err);

        res.status(500).json({
            error: "Failed to fetch mess details"
        });
    }
};

// ===============================
// Register Mess
// ===============================
const registerMess = async (req, res) => {
    const {
        name,
        location,
        googleMapsLink,
        fullAddress,
        ownerPhone,
        email
    } = req.body;

    if (!name || !location || !googleMapsLink) {
        return res.status(400).json({
            error: "Name, location and Google Maps link are required"
        });
    }

    try {
        // A user can own only one mess
        const existingOwnedMess = await Mess.findOne({
            ownerId: req.userId
        });

        if (existingOwnedMess) {
            return res.status(409).json({
                error: "You already own a mess"
            });
        }

        // Mess name must be unique
        const existingMess = await Mess.findOne({
            name
        });

        if (existingMess) {
            return res.status(409).json({
                error: "Mess already exists"
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const newMess = await Mess.create({
            name,
            location,
            googleMapsLink,
            fullAddress,
            ownerPhone,
            email,
            ownerId: req.userId
        });

        // Upgrade user to mess owner
        if (user.role !== "mess_owner") {
            user.role = "mess_owner";
            await user.save();
        }

        res.status(201).json({
            message: "Mess registered successfully",
            messId: newMess._id,
            role: "mess_owner"
        });

    } catch (err) {
        console.error("Mess registration error:", err);

        res.status(500).json({
            error: "Mess registration failed"
        });
    }
};

// ===============================
// Get Current Owner's Mess
// ===============================
const getMyMess = async (req, res) => {
    try {
        const mess = await Mess.findOne({
            ownerId: req.userId
        });

        if (!mess) {
            return res.status(404).json({
                error: "No mess found for this user"
            });
        }

        res.status(200).json(mess);
    } catch (err) {
        console.error("Get my mess error:", err);

        res.status(500).json({
            error: "Failed to fetch your mess"
        });
    }
};

// ===============================
// Update Mess
// ===============================
const updateMess = async (req, res) => {
    try {
        const mess = await Mess.findById(req.params.id);

        if (!mess) {
            return res.status(404).json({
                error: "Mess not found"
            });
        }

        // Only owner or admin can update
        if (
            mess.ownerId &&
            mess.ownerId.toString() !== req.userId &&
            req.role !== "admin"
        ) {
            return res.status(403).json({
                error: "You are not authorized to update this mess"
            });
        }

        const {
            name,
            location,
            fullAddress,
            ownerPhone,
            email
        } = req.body;

        if (name !== undefined) {
            const existingMess = await Mess.findOne({
                name,
                _id: { $ne: req.params.id }
            });

            if (existingMess) {
                return res.status(409).json({
                    error: "Another mess already uses this name"
                });
            }

            mess.name = name;
        }

        if (location !== undefined) {
            mess.location = location;
        }

        if (fullAddress !== undefined) {
            mess.fullAddress = fullAddress;
        }

        if (ownerPhone !== undefined) {
            mess.ownerPhone = ownerPhone;
        }

        if (email !== undefined) {
            mess.email = email;
        }

        await mess.save();

        res.status(200).json({
            message: "Mess updated successfully",
            mess
        });

    } catch (err) {
        console.error("Update mess error:", err);

        res.status(500).json({
            error: "Failed to update mess"
        });
    }
};

// ===============================
// Add Menu Item
// ===============================
const addMenuItem = async (req, res) => {
    const {
        name,
        price,
        contents
    } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({
            error: "Menu item name and price are required"
        });
    }

    if (Number(price) < 0) {
        return res.status(400).json({
            error: "Price cannot be negative"
        });
    }

    try {
        const mess = await Mess.findById(req.params.messId);

        if (!mess) {
            return res.status(404).json({
                error: "Mess not found"
            });
        }

        // Only owner or admin can modify menu
        if (
            mess.ownerId &&
            mess.ownerId.toString() !== req.userId &&
            req.role !== "admin"
        ) {
            return res.status(403).json({
                error: "You are not authorized to modify this menu"
            });
        }

        mess.menuItems.push({
            name,
            price: Number(price),
            contents
        });

        await mess.save();

        const newItem =
            mess.menuItems[mess.menuItems.length - 1];

        res.status(201).json(newItem);

    } catch (err) {
        console.error("Add menu item error:", err);

        res.status(500).json({
            error: "Failed to add menu item"
        });
    }
};

// ===============================
// Update Menu Item
// ===============================
const updateMenuItem = async (req, res) => {
    const {
        name,
        price,
        contents
    } = req.body;

    try {
        const mess = await Mess.findById(req.params.messId);

        if (!mess) {
            return res.status(404).json({
                error: "Mess not found"
            });
        }

        // Only owner or admin can modify menu
        if (
            mess.ownerId &&
            mess.ownerId.toString() !== req.userId &&
            req.role !== "admin"
        ) {
            return res.status(403).json({
                error: "You are not authorized to modify this menu"
            });
        }

        const item = mess.menuItems.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                error: "Menu item not found"
            });
        }

        if (name !== undefined) {
            item.name = name;
        }

        if (price !== undefined) {
            if (Number(price) < 0) {
                return res.status(400).json({
                    error: "Price cannot be negative"
                });
            }

            item.price = Number(price);
        }

        if (contents !== undefined) {
            item.contents = contents;
        }

        await mess.save();

        res.status(200).json(item);

    } catch (err) {
        console.error("Update menu item error:", err);

        res.status(500).json({
            error: "Failed to update menu item"
        });
    }
};

// ===============================
// Delete Menu Item
// ===============================
const deleteMenuItem = async (req, res) => {
    try {
        const mess = await Mess.findById(req.params.messId);

        if (!mess) {
            return res.status(404).json({
                error: "Mess not found"
            });
        }

        // Only owner or admin can modify menu
        if (
            mess.ownerId &&
            mess.ownerId.toString() !== req.userId &&
            req.role !== "admin"
        ) {
            return res.status(403).json({
                error: "You are not authorized to modify this menu"
            });
        }

        const item = mess.menuItems.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                error: "Menu item not found"
            });
        }

        item.deleteOne();

        await mess.save();

        res.status(200).json({
            message: "Menu item deleted successfully"
        });

    } catch (err) {
        console.error("Delete menu item error:", err);

        res.status(500).json({
            error: "Failed to delete menu item"
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

        // Only owner or admin can delete
        if (
            mess.ownerId &&
            mess.ownerId.toString() !== req.userId &&
            req.role !== "admin"
        ) {
            return res.status(403).json({
                error: "You are not authorized to delete this mess"
            });
        }

        await Mess.findByIdAndDelete(req.params.id);

        // If the owner deletes their mess, downgrade them to normal user
        if (req.role === "mess_owner") {
            await User.findByIdAndUpdate(
                req.userId,
                { role: "user" }
            );
        }

        res.status(200).json({
            message: "Mess deleted successfully"
        });

    } catch (err) {
        console.error("Delete mess error:", err);

        res.status(500).json({
            error: "Failed to delete mess"
        });
    }
};

module.exports = {
    getAllMesses,
    getMessById,
    registerMess,
    getMyMess,
    updateMess,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    deleteMess
};