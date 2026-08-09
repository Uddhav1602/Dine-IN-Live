const mongoose = require("mongoose");

const MessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    location: {
        type: String,
        required: true
    },

    fullAddress: {
        type: String
    },

    ownerPhone: String,

    email: String,

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    rating: {
        type: Number,
        default: 4.0
    },

    menuItems: [
        {
            name: String,
            price: Number,
            contents: String
        }
    ]
});

const messModel = mongoose.model("Mess", MessSchema);

module.exports = messModel;