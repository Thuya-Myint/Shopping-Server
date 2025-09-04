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
        type: String,
        enum: ["superadmin", "admin", "user", "saleman"],
        required: true,
        default: "user"
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: true
    },
    allowedPaths: {
        type: [String],
        require: true,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("users", userModelSchema)