const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
    const {
        username,
        email,
        phone,
        address,
        password
    } = req.body;

    if (
        !username ||
        !email ||
        !phone ||
        !address ||
        !password
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    try {
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                error: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await User.create({
            username,
            email,
            phone,
            address,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (err) {
        console.error("Registration error:", err);

        res.status(500).json({
            error: "Server error during registration"
        });
    }
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Username and password are required"
        });
    }

    try {
        const user = await User.findOne({
            username
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET || "secretkey",
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful"
        });

    } catch (err) {
        console.error("Login error:", err);

        res.status(500).json({
            error: "Login failed due to server error"
        });
    }
};

// ===============================
// Get Current Authenticated User
// ===============================
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json({
            authenticated: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Get current user error:", err);

        res.status(500).json({
            error: "Failed to fetch current user"
        });
    }
};

// ===============================
// Logout User
// ===============================
const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
};