const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// ===============================
// JWT Middleware
// ===============================
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secretkey"
        );

        req.userId = decoded.userId;

        // Fetch the current role from the database
        // instead of trusting the JWT payload.
        const user = await User.findById(decoded.userId).select("role");

        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        req.role = user.role;

        next();
    } catch (err) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
};

// ===============================
// Admin-only Middleware
// ===============================
const verifyAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({
            error: "Access denied: Admins only"
        });
    }

    next();
};

// ===============================
// Mess Owner (or Admin) Middleware
// ===============================
const verifyMessOwner = (req, res, next) => {
    if (req.role !== "mess_owner" && req.role !== "admin") {
        return res.status(403).json({
            error: "Access denied: Mess owners only"
        });
    }

    next();
};

// ===============================
// Export Middleware
// ===============================
module.exports = {
    verifyToken,
    verifyMessOwner,
    verifyAdmin
};