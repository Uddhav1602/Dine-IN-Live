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

    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
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

    const { username, password } = req.body;

    // console.log(`🔹 Login Attempt for: ${username}`);

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET || "secretkey",
            {
                expiresIn: "7d"
            }
        );

        // Store JWT in an HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            userId: user._id,
            username: user.username,
            role: user.role
        });
        
    } catch (err) {

        console.error("❌ SERVER ERROR:", err);

        res.status(500).json({
            error: "Login failed due to server error"
        });

    }
};

// ===============================
// Export Controllers
// ===============================
module.exports = {
    registerUser,
    loginUser
};