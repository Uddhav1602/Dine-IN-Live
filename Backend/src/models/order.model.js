const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
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

    messName: String,

    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.model("Order", OrderSchema);

module.exports = orderModel;