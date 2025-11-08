const mongoose = require("mongoose")


const userModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: false,
        unique: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles"
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: true
    },
    allowedPaths: {
        type: [String],
        required: true,
    },
    imageUrl: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("users", userModelSchema)