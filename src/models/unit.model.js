const mongoose = require("mongoose")


const unitModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    shopId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "user"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("unit", unitModelSchema)