const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
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
        contents: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        _id: true
    }
);

const MessSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        googleMapsLink: {
            type: String,
            required: true,
            trim: true
        },

        fullAddress: {
            type: String,
            trim: true,
            default: ""
        },

        ownerPhone: {
            type: String,
            trim: true,
            default: ""
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        rating: {
            type: Number,
            default: 4.0,
            min: 0,
            max: 5
        },

        menuItems: {
            type: [MenuItemSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Mess = mongoose.model("Mess", MessSchema);

module.exports = Mess;