const mongoose = require("mongoose")


const unitModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("unit", unitModelSchema)