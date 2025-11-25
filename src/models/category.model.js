const mongoose = require("mongoose")


const categoryModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    shopId: {
        type: mongoose.Schema.ObjectId
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("category", categoryModelSchema)