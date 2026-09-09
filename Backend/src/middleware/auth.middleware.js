const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET is not configured in .env");
}

// ===============================
// Verify Authentication
// ===============================
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET || "secretkey"
        );

        if (!decoded.userId) {
            return res.status(401).json({
                error: "Invalid authentication token"
            });
        }

        const user = await User.findById(decoded.userId)
            .select("_id role");

        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        req.userId = user._id.toString();
        req.role = user.role;

        next();

    } catch (err) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
};

// ===============================
// Verify Admin
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
// Verify Mess Owner
// ===============================
const verifyMessOwner = (req, res, next) => {
    if (
        req.role !== "mess_owner" &&
        req.role !== "admin"
    ) {
        return res.status(403).json({
            error: "Access denied: Mess owners only"
        });
    }

    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyMessOwner
};