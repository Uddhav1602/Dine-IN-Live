const Order = require("../models/order.model");
const Mess = require("../models/mess.model");

// ===============================
// Place Order
// ===============================
const placeOrder = async (req, res) => {
    const {
        messId,
        messName,
        items,
        totalAmount
    } = req.body;

    if (
        !messId ||
        !Array.isArray(items) ||
        items.length === 0 ||
        totalAmount === undefined
    ) {
        return res.status(400).json({
            error: "Invalid order data"
        });
    }

    try {
        // Make sure the mess exists
        const mess = await Mess.findById(messId);

        if (!mess) {
            return res.status(404).json({
                error: "Mess not found"
            });
        }

        const newOrder = await Order.create({
            userId: req.userId,
            messId,
            messName: messName || mess.name,
            items,
            totalAmount
        });

        res.status(201).json({
            message: "Order placed successfully",
            orderId: newOrder._id
        });

    } catch (err) {
        console.error("Place order error:", err);

        res.status(500).json({
            error: "Failed to place order"
        });
    }
};

// ===============================
// Get Current User's Orders
// ===============================
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json(orders);

    } catch (err) {
        console.error("Fetch orders error:", err);

        res.status(500).json({
            error: "Failed to fetch orders"
        });
    }
};

// ===============================
// Get Single Order
// ===============================
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                error: "Order not found"
            });
        }

        // Users can only view their own orders
        if (
            order.userId.toString() !== req.userId &&
            req.role !== "admin"
        ) {
            return res.status(403).json({
                error: "You are not authorized to view this order"
            });
        }

        res.status(200).json(order);

    } catch (err) {
        console.error("Fetch order error:", err);

        res.status(500).json({
            error: "Failed to fetch order"
        });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById
};