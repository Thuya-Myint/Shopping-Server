const mongoose = require("mongoose")

const sizeModelSchema = new mongoose.Schema({
    sizeNo: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("sizes", sizeModelSchema)