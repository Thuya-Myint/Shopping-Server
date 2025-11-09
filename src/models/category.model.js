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
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("category", categoryModelSchema)