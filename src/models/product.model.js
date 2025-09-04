const mongoose = require("mongoose")


const productModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    modelNo: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
    },
    size: {
        type: [Object],
        required: true
    },
    variants: {
        type: [Object],
        required: false
    },
    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"],
        required: true,
        default: "Unisex"
    },
    discount: {
        type: Number,
        required: true,
        default: 0

    }
}, {
    timestamps: true
})

module.exports = mongoose.model("product", productModelSchema)