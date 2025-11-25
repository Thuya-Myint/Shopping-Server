const mongoose = require("mongoose");
const Role = require("./role.model");

const userModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
        required: false   // allow empty, pre-save hook will fill it
    },

    isLoggedIn: {
        type: Boolean,
        default: true
    },

    allowedPaths: {
        type: [String],
        required: true,
    },

    imageUrl: {
        type: String
    },

    active: {
        type: Boolean,
        default: true
    },
    paymentMethods: {
        type: [Object],
        required: false
    }

}, { timestamps: true });


// ✅ PRE-SAVE HOOK — automatically assign default role = "user"
userModelSchema.pre("save", async function (next) {
    if (!this.role) {
        const userRole = await Role.findOne({ name: "user" });

        if (!userRole) {
            // ❌ Role doesn't exist
            throw new Error('Default role "user" not found in roles collection.');
        }

        // ✅ Set default role ID
        this.role = userRole._id;
    }

    next();
});


module.exports = mongoose.model("users", userModelSchema);