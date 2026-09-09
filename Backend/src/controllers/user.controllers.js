const User = require("../models/user.model");

// ===============================
// Get Current User Profile
// ===============================
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (err) {
        console.error("Get profile error:", err);

        res.status(500).json({
            error: "Failed to fetch profile"
        });
    }
};

module.exports = {
    getMyProfile
};