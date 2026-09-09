const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const messRoutes = require("./routes/mess.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// ===============================
// Database
// ===============================
connectDB();

// ===============================
// Middleware
// ===============================
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messes", messRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Dine-IN-Live API is running"
    });
});

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// ===============================
// Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});