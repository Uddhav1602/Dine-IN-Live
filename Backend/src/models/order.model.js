const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        messId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mess",
            required: true
        },

        messName: {
            type: String,
            required: true,
            trim: true
        },

        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Order must contain at least one item"
            }
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Preparing",
                "Ready",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;